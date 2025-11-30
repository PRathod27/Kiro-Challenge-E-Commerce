const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Get analytics dashboard
exports.getAnalytics = async (req, res) => {
  try {
    // Get date ranges
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Sales trends (last 30 days)
    const salesTrends = await Order.aggregate([
      {
        $match: {
          purchaseDate: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" }
          },
          revenue: { $sum: "$price" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $group: {
          _id: "$productId",
          productName: { $first: "$productName" },
          totalSold: { $sum: "$quantity" },
          revenue: { $sum: { $multiply: ["$price", "$quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    
    // Customer growth
    const customerGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Summary stats
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort({ purchaseDate: -1 })
      .limit(10)
      .lean();
    
    // Low stock products
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    }).limit(10);
    
    res.render('admin/analytics', {
      salesTrends,
      topProducts,
      customerGrowth,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        totalCustomers,
        totalProducts
      },
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.render('admin/analytics', {
      salesTrends: [],
      topProducts: [],
      customerGrowth: [],
      stats: { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0 },
      recentOrders: [],
      lowStockProducts: [],
      error: 'Failed to load analytics'
    });
  }
};
