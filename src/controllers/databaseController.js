const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Show database viewer page
exports.showDatabaseViewer = async (req, res) => {
  try {
    const { collection, search } = req.query;
    let data = [];
    let selectedCollection = collection || 'users';

    // Fetch data based on selected collection
    if (selectedCollection === 'users') {
      const query = search ? { 
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      } : {};
      data = await User.find(query).select('-password').lean();
    } else if (selectedCollection === 'products') {
      const query = search ? { 
        $or: [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ]
      } : {};
      data = await Product.find(query).lean();
    } else if (selectedCollection === 'orders') {
      const query = search ? { 
        $or: [
          { customerName: new RegExp(search, 'i') },
          { customerEmail: new RegExp(search, 'i') },
          { productName: new RegExp(search, 'i') }
        ]
      } : {};
      data = await Order.find(query).lean();
    }

    res.render('admin/database', { 
      data, 
      selectedCollection,
      search: search || ''
    });
  } catch (error) {
    console.error('Error fetching database data:', error);
    res.render('admin/database', { 
      data: [], 
      selectedCollection: 'users',
      search: '',
      error: 'Failed to load database data' 
    });
  }
};

// Export data to CSV
exports.exportToCSV = async (req, res) => {
  try {
    const { collection } = req.query;
    let data = [];
    let filename = 'export.csv';

    if (collection === 'users') {
      data = await User.find().select('-password').lean();
      filename = 'users.csv';
    } else if (collection === 'products') {
      data = await Product.find().lean();
      filename = 'products.csv';
    } else if (collection === 'orders') {
      data = await Order.find().lean();
      filename = 'orders.csv';
    }

    // Convert to CSV
    if (data.length === 0) {
      return res.status(404).send('No data to export');
    }

    const headers = Object.keys(data[0]).filter(key => key !== '__v');
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value).replace(/,/g, ';');
        return String(value).replace(/,/g, ';');
      });
      csv += values.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send('Failed to export data');
  }
};
