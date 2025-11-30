const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { productId } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check stock
    if (product.stock <= 0) {
      return res.status(400).json({ success: false, error: 'Product out of stock' });
    }

    // Get user details
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    // Calculate profit
    const profit = product.price - product.cost;
    
    // Reduce stock
    product.stock -= 1;
    await product.save();

    // Create order with denormalized data
    const order = new Order({
      userId: user._id,
      productId: product._id,
      customerName: user.name,
      customerEmail: user.email,
      productName: product.name,
      price: product.price,
      cost: product.cost,
      profit: profit,
      invoiceSent: true,
      emailStatus: 'sent'
    });

    await order.save();

    res.json({ 
      success: true, 
      message: 'Order placed successfully! View your invoice in My Orders.',
      orderId: order._id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ purchaseDate: -1 })
      .lean();

    res.render('admin/dashboard', { orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.render('admin/dashboard', { orders: [], error: 'Failed to load orders' });
  }
};

// Get orders by user
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.userId })
      .sort({ purchaseDate: -1 })
      .lean();

    res.render('my-orders', { orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.render('my-orders', { orders: [], error: 'Failed to fetch orders' });
  }
};

// Reorder (create new order from existing order)
exports.reorder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Verify order belongs to user
    if (existingOrder.userId.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    const Product = require('../models/Product');
    const product = await Product.findById(existingOrder.productId);
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product no longer available' });
    }
    
    // Create new order
    const newOrder = new Order({
      userId: existingOrder.userId,
      productId: existingOrder.productId,
      customerName: existingOrder.customerName,
      customerEmail: existingOrder.customerEmail,
      productName: product.name,
      price: product.price,
      cost: product.cost,
      profit: product.price - product.cost,
      quantity: existingOrder.quantity,
      invoiceSent: true,
      emailStatus: 'sent'
    });
    
    await newOrder.save();
    
    res.json({ success: true, message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (error) {
    console.error('Error reordering:', error);
    res.status(500).json({ success: false, error: 'Failed to reorder' });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, note } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    order.status = status;
    order.statusHistory.push({
      status,
      date: new Date(),
      note: note || `Status updated to ${status}`
    });
    
    await order.save();
    
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
};

// View single invoice
exports.viewInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).send('Invoice not found');
    }

    // Verify the order belongs to the logged-in user
    if (order.userId.toString() !== req.session.userId.toString()) {
      return res.status(403).send('Access denied');
    }

    res.render('invoice', { order });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).send('Failed to load invoice');
  }
};
