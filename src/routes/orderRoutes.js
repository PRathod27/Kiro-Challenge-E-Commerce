const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

// Order routes (require authentication)
router.post('/orders', requireAuth, orderController.createOrder);
router.post('/orders/reorder', requireAuth, orderController.reorder);
router.post('/orders/status', requireAuth, orderController.updateOrderStatus);
router.get('/my-orders', requireAuth, orderController.getOrdersByUser);
router.get('/invoice/:id', requireAuth, orderController.viewInvoice);

module.exports = router;
