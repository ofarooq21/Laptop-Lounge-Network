const Offer = require('../models/offerModel');
const Item  = require('../models/itemModel');
const mongoose = require('mongoose');

/* helper */
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* POST /items/:itemId/offers  – make offer */
exports.makeOffer = async (req, res) => {
  const { itemId } = req.params;
  const amount = parseFloat(req.body.amount);

  if (!isValidId(itemId) || amount <= 0) {
    return res.status(400).render('error', { code: 400, message: 'Bad request.' });
  }

  const item = await Item.findById(itemId).populate('seller');
  if (!item || !item.active)
    return res.status(404).render('error', { code: 404, message: 'Item not found.' });

  /* seller cannot offer on own item */
  if (String(item.seller._id) === req.session.userId)
    return res.status(401).render('error', { code: 401, message: 'Unauthorized.' });

  await Offer.create({ amount, buyer: req.session.userId, item: itemId });

  /* update counters */
  item.totalOffers += 1;
  if (amount > item.highestOffer) item.highestOffer = amount;
  await item.save();

  req.flash('success', 'Offer submitted.');
  res.redirect('/items/' + itemId);
};

/* GET /items/:itemId/offers  – view offers (seller only) */
exports.viewOffers = async (req, res) => {
  const { itemId } = req.params;
  if (!isValidId(itemId))
    return res.status(400).render('error', { code: 400, message: 'Bad request.' });

  const item = await Item.findById(itemId).populate('seller');
  if (!item)
    return res.status(404).render('error', { code: 404, message: 'Item not found.' });

  if (String(item.seller._id) !== req.session.userId)
    return res.status(401).render('error', { code: 401, message: 'Unauthorized.' });

  const offers = await Offer.find({ item: itemId }).populate('buyer').sort({ amount: -1 });
  res.render('offers/offers', { item, offers });
};

/* POST /items/:itemId/offers/:offerId/accept – accept offer */
exports.acceptOffer = async (req, res) => {
  const { itemId, offerId } = req.params;
  if (!isValidId(itemId) || !isValidId(offerId))
    return res.status(400).render('error', { code: 400, message: 'Bad request.' });

  const item = await Item.findById(itemId).populate('seller');
  if (!item)
    return res.status(404).render('error', { code: 404, message: 'Item not found.' });

  if (String(item.seller._id) !== req.session.userId)
    return res.status(401).render('error', { code: 401, message: 'Unauthorized.' });

  /* update DB in parallel */
  await Promise.all([
    Item.findByIdAndUpdate(itemId, { active: false }),
    Offer.findByIdAndUpdate(offerId, { status: 'accepted' }),
    Offer.updateMany({ item: itemId, _id: { $ne: offerId } }, { status: 'rejected' })
  ]);

  req.flash('success', 'Offer accepted.');
  res.redirect(`/items/${itemId}/offers`);
};