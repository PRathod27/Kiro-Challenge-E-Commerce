const Cart = require('../models/Cart');
const Product = require('../models/Product');

// View cart
exports.viewCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.session.userId });
    
    if (!cart) {
      cart = { items: [], total: 0 };
    }
    
    // Calculate total
    const total = cart.items ? cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
    
    res.render('cart', { cart, total });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.render('cart', { cart: { items: [] }, total: 0, error: 'Failed to load cart' });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ userId: req.session.userId });
    
    if (!cart) {
      cart = new Cart({
        userId: req.session.userId,
        items: []
      });
    }
    
    // Check if product already in cart
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += parseInt(quantity) || 1;
    } else {
      cart.items.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: parseInt(quantity) || 1
      });
    }
    
    await cart.save();
    
    res.json({ success: true, message: 'Added to cart', cartCount: cart.items.length });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }
    
    item.quantity = parseInt(quantity);
    await cart.save();
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({ success: true, total });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    
    res.json({ success: true, message: 'Removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, error: 'Failed to remove from cart' });
  }
};

// Checkout (create orders from cart)
exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }
    
    const User = require('../models/User');
    const Order = require('../models/Order');
    
    const user = await User.findById(req.session.userId);
    
    // Create orders for each item
    const orders = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const order = new Order({
          userId: user._id,
          productId: product._id,
          customerName: user.name,
          customerEmail: user.email,
          productName: product.name,
          price: product.price,
          cost: product.cost,
          profit: product.price - product.cost,
          quantity: item.quantity,
          invoiceSent: true,
          emailStatus: 'sent'
        });
        await order.save();
        orders.push(order);
      }
    }
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.json({ success: true, message: 'Order placed successfully!', orderCount: orders.length });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ success: false, error: 'Failed to complete checkout' });
  }
};
