const Item = require('../models/itemModel');

/* Ensure guest (not logged in) */
exports.isGuest = (req, res, next) => {
  if (req.session.userId) {
    req.flash('error', 'Already logged in.');
    return res.redirect('/users/profile');
  }
  next();
};

/* Ensure logged in */
exports.isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'Login required.');
    return res.redirect('/users/login');
  }
  next();
};

/* Ensure current user owns the item */
exports.isSeller = async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item || String(item.seller) !== req.session.userId) {
    return res.status(401).render('error', {
      code: 401,
      message: 'Unauthorized.'
    });
  }
  next();
};