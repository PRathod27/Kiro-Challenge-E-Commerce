const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { requireAuth } = require('../middleware/auth');

// All wishlist routes require authentication
router.use(requireAuth);

router.get('/', wishlistController.viewWishlist);
router.post('/add', wishlistController.addToWishlist);
router.post('/remove', wishlistController.removeFromWishlist);
router.post('/move-to-cart', wishlistController.moveToCart);

module.exports = router;
