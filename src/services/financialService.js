const Order = require('../models/Order');

// Get start and end dates for current month
const getCurrentMonthDates = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
};

// Calculate monthly revenue
const calculateMonthlyRevenue = async (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const result = await Order.aggregate([
    {
      $match: {
        purchaseDate: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$price' }
      }
    }
  ]);

  return result.length > 0 ? result[0].totalRevenue : 0;
};

// Calculate monthly cost
const calculateMonthlyCost = async (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const result = await Order.aggregate([
    {
      $match: {
        purchaseDate: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        totalCost: { $sum: '$cost' }
      }
    }
  ]);

  return result.length > 0 ? result[0].totalCost : 0;
};

// Calculate monthly profit
const calculateProfit = async (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const result = await Order.aggregate([
    {
      $match: {
        purchaseDate: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        totalProfit: { $sum: '$profit' }
      }
    }
  ]);

  return result.length > 0 ? result[0].totalProfit : 0;
};

// Calculate profit margin percentage
const getProfitMargin = (revenue, profit) => {
  if (revenue === 0) return 0;
  return ((profit / revenue) * 100).toFixed(2);
};

// Get complete financial report for current month
const getMonthlyReport = async () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const revenue = await calculateMonthlyRevenue(month, year);
  const cost = await calculateMonthlyCost(month, year);
  const profit = await calculateProfit(month, year);
  const profitMargin = getProfitMargin(revenue, profit);

  return {
    month,
    year,
    revenue: revenue.toFixed(2),
    cost: cost.toFixed(2),
    profit: profit.toFixed(2),
    profitMargin: profitMargin
  };
};

module.exports = {
  calculateMonthlyRevenue,
  calculateMonthlyCost,
  calculateProfit,
  getProfitMargin,
  getMonthlyReport
};
