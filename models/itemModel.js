const mongoose = require('mongoose');
const Offer     = require('./offerModel');

const itemSchema = new mongoose.Schema({
  title:     { type: String, required: [true, 'Title required.'], trim: true },
  seller:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Excellent', 'Good', 'Fair'],
    required: [true, 'Condition required.']
  },
  price:     { type: Number, min: 0.01, required: [true, 'Price required.'] },
  details:   { type: String, required: [true, 'Details required.'] },
  image:     {
    type: String,
    default: 'https://via.placeholder.com/400?text=No+Image',
    trim: true
  },
  active:        { type: Boolean, default: true },
  totalOffers:   { type: Number, default: 0 },
  highestOffer:  { type: Number, default: 0 }
});

/* cascade delete offers when item removed */
itemSchema.pre('remove', async function () {
  await Offer.deleteMany({ item: this._id });
});

module.exports = mongoose.model('Item', itemSchema);