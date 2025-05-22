const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true, trim: true },
  password:  { type: String, required: true }
});

/* 🔸 virtual: all items this user listed */
userSchema.virtual('itemsListed', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'seller'
});

/* hash pw */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* login helper */
userSchema.statics.authenticate = async function (email, pw) {
  const user = await this.findOne({ email });
  return user && (await bcrypt.compare(pw, user.password)) ? user : null;
};

module.exports = mongoose.model('User', userSchema);