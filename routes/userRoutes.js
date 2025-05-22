const express      = require('express');
const router       = express.Router();
const usersCtrl    = require('../controllers/usersController');
const { isGuest, isLoggedIn } = require('../middleware/auth');

/* Landing page */
router.get('/', (req, res) => res.render('index'));

/* Sign‑up */
router.get('/users/new',            isGuest,      usersCtrl.renderSignup);
router.post('/users',               isGuest,      usersCtrl.signup);

/* Login */
router.get('/users/login',          isGuest,      usersCtrl.renderLogin);
router.post('/users/login',         isGuest,      usersCtrl.login);

/* Profile */
router.get('/users/profile',        isLoggedIn,   usersCtrl.profile);

/* Logout */
router.get('/users/logout',         isLoggedIn,   usersCtrl.logout);

module.exports = router;