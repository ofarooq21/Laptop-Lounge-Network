const mongoose = require('mongoose');
const Item     = require('../models/itemModel');
const Offer    = require('../models/offerModel');   // new

/* ─────────────────────────
   Helpers
────────────────────────── */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ─────────────────────────
   GET /items  – browse / search
────────────────────────── */
exports.getAllItems = async (req, res) => {
  const search = req.query.search;
  const filter = search
    ? {
        active: true,
        $or: [
          { title:   { $regex: search, $options: 'i' } },
          { details: { $regex: search, $options: 'i' } }
        ]
      }
    : { active: true };

  const items = await Item.find(filter)
                  .sort({ price: 1 })
                  .populate('seller')
                  .lean();

  res.render('items', {
    items,
    searchTerm: search || '',
    message: search && items.length === 0 ? `No items for "${search}"` : ''
  });
};

/* ─────────────────────────
   GET /items/new – item form
────────────────────────── */
exports.showNewForm = (req, res) => res.render('new');

/* ─────────────────────────
   POST /items – create item
────────────────────────── */
exports.createItem = async (req, res) => {
  try {
    const { title, condition, price, details, image } = req.body;
    await Item.create({
      title,
      condition,
      price,
      details,
      image: image?.trim() || undefined,
      seller: req.session.userId
    });
    req.flash('success', 'Listing created.');
    res.redirect('/items');
  } catch (err) {
    req.flash('error', 'Validation error.');
    res.redirect('back');
  }
};

/* ─────────────────────────
   GET /items/:id – detail
────────────────────────── */
exports.getItemById = async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).render('error', { code: 400, message: 'Invalid ID' });

  const item = await Item.findById(req.params.id).populate('seller').lean();
  if (!item)
    return res.status(404).render('error', { code: 404, message: 'Not found' });

  /* optional: we fetch offers solely for seller's offer list; not used in template otherwise */
  const offers = await Offer.find({ item: item._id }).sort({ amount: -1 }).lean();

  res.render('item', { item, offers });
};

/* ─────────────────────────
   GET /items/:id/edit – edit form
────────────────────────── */
exports.showEditForm = async (req, res) => {
  const item = await Item.findById(req.params.id).lean();
  res.render('edit', { item });
};

/* ─────────────────────────
   PUT /items/:id – update
────────────────────────── */
exports.updateItem = async (req, res) => {
  const updates = { ...req.body };
  if (!updates.image) delete updates.image;
  await Item.findByIdAndUpdate(req.params.id, updates, { runValidators: true });
  req.flash('success', 'Item updated.');
  res.redirect(`/items/${req.params.id}`);
};

/* ─────────────────────────
   DELETE /items/:id – delete
   (triggers cascade offer removal via pre('remove'))
────────────────────────── */
exports.deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    req.flash('error', 'Item not found.');
    return res.redirect('/items');
  }
  await item.remove();
  req.flash('success', 'Item deleted.');
  res.redirect('/items');
};