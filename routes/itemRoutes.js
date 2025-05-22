const express  = require('express');
const router   = express.Router();
const itemsCtrl = require('../controllers/itemsController');
const { isLoggedIn, isSeller } = require('../middleware/auth');

/* Browse / search */
router.get('/',            itemsCtrl.getAllItems);

/* New */
router.get('/new',         isLoggedIn, itemsCtrl.showNewForm);
router.post('/',           isLoggedIn, itemsCtrl.createItem);

/* Detail */
router.get('/:id',         itemsCtrl.getItemById);

/* Edit */
router.get('/:id/edit',    isLoggedIn, isSeller, itemsCtrl.showEditForm);
router.put('/:id',         isLoggedIn, isSeller, itemsCtrl.updateItem);

/* Delete */
router.delete('/:id',      isLoggedIn, isSeller, itemsCtrl.deleteItem);

router.use('/:itemId/offers', require('./offerRoutes'));

module.exports = router;