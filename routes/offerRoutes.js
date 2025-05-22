const express = require('express');
const router  = express.Router({ mergeParams: true });
const { isLoggedIn } = require('../middleware/auth');
const offersCtrl = require('../controllers/offersController');

/* make an offer */
router.post('/', isLoggedIn, offersCtrl.makeOffer);

/* view offers on an item (seller) */
router.get('/', isLoggedIn, offersCtrl.viewOffers);

/* accept a specific offer */
router.post('/:offerId/accept', isLoggedIn, offersCtrl.acceptOffer);

module.exports = router;