const Product = require('../models/Product');
const financialService = require('../services/financialService');

// Show admin products page
exports.showProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/products', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.render('admin/products', { products: [], error: 'Failed to load products' });
  }
};

// Show financial reports page
exports.showReports = async (req, res) => {
  try {
    const report = await financialService.getMonthlyReport();
    res.render('admin/reports', { report });
  } catch (error) {
    console.error('Error generating report:', error);
    res.render('admin/reports', { 
      report: null, 
      error: 'Failed to generate financial report' 
    });
  }
};
