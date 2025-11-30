const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// View wishlist
exports.viewWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.session.userId });
    
    if (!wishlist) {
      wishlist = { items: [] };
    }
    
    res.render('wishlist', { wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.render('wishlist', { wishlist: { items: [] }, error: 'Failed to load wishlist' });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    let wishlist = await Wishlist.findOne({ userId: req.session.userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.session.userId,
        items: []
      });
    }
    
    // Check if already in wishlist
    const exists = wishlist.items.find(item => item.productId.toString() === productId);
    if (exists) {
      return res.json({ success: false, error: 'Already in wishlist' });
    }
    
    wishlist.items.push({
      productId: product._id,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl
    });
    
    await wishlist.save();
    
    res.json({ success: true, message: 'Added to wishlist', wishlistCount: wishlist.items.length });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, error: 'Failed to add to wishlist' });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const wishlist = await Wishlist.findOne({ userId: req.session.userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, error: 'Wishlist not found' });
    }
    
    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
    await wishlist.save();
    
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ success: false, error: 'Failed to remove from wishlist' });
  }
};

// Move to cart
exports.moveToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const Cart = require('../models/Cart');
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Add to cart
    let cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) {
      cart = new Cart({ userId: req.session.userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      });
    }
    await cart.save();
    
    // Remove from wishlist
    const wishlist = await Wishlist.findOne({ userId: req.session.userId });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
      await wishlist.save();
    }
    
    res.json({ success: true, message: 'Moved to cart' });
  } catch (error) {
    console.error('Error moving to cart:', error);
    res.status(500).json({ success: false, error: 'Failed to move to cart' });
  }
};
