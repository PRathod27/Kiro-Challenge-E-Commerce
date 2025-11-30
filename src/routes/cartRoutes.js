const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

// All cart routes require authentication
router.use(requireAuth);

router.get('/', cartController.viewCart);
router.post('/add', cartController.addToCart);
router.post('/update', cartController.updateCartItem);
router.post('/remove', cartController.removeFromCart);
router.post('/checkout', cartController.checkout);

module.exports = router;
