const User  = require('../models/userModel');

/* GET /users/new */
exports.renderSignup = (req, res) => res.render('users/new');

/* POST /users */
exports.signup = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    req.flash('success', 'Account created. Please log in.');
    res.redirect('/users/login');
  } catch (err) {
    req.flash('error', err.code === 11000
      ? 'Email already in use.'
      : 'Signup error.');
    res.redirect('back');
  }
};

/* GET /users/login */
exports.renderLogin = (req, res) => res.render('users/login');

/* POST /users/login */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.authenticate(email, password);
  if (!user) {
    req.flash('error', 'Invalid credentials.');
    return res.redirect('back');
  }
  req.session.userId = user._id;
  req.flash('success', 'Logged in.');
  res.redirect('/users/profile');
};

/* GET /users/profile */
exports.profile = async (req, res) => {
  const user = await User.findById(req.session.userId)
    .populate('itemsListed')
    .lean();

  const offersMade = await require('../models/offerModel')
                      .find({ buyer: req.session.userId })
                      .populate({ path:'item', select:'title active' })
                      .sort({ createdAt: -1 })
                      .lean();

  res.render('users/profile', { user, offersMade });
};

/* GET /users/logout */
exports.logout = (req, res) => {
    /* set flash first, while session is alive */
    req.flash('success', 'Logged out.');
  
    /* then destroy session */
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  };