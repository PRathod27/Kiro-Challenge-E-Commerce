const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');

// Add review (requires authentication)
router.post('/', requireAuth, reviewController.addReview);

// Get reviews for a product (public)
router.get('/product/:productId', reviewController.getProductReviews);

// Delete review (requires authentication)
router.delete('/:reviewId', requireAuth, reviewController.deleteReview);

module.exports = router;
