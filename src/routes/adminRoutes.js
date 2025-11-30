const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const databaseController = require('../controllers/databaseController');
const analyticsController = require('../controllers/analyticsController');
const { requireAdmin } = require('../middleware/auth');

// All admin routes require admin authentication
router.use(requireAdmin);

// Admin dashboard routes
router.get('/dashboard', orderController.getAllOrders);
router.get('/products', adminController.showProducts);
router.get('/reports', adminController.showReports);
router.get('/analytics', analyticsController.getAnalytics);
router.get('/database', databaseController.showDatabaseViewer);
router.get('/database/export', databaseController.exportToCSV);

module.exports = router;
