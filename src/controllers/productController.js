const Product = require('../models/Product');

// Get all products (for home page) with search and filters
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1 } = req.query;
    const limit = 12; // Products per page
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Build sort
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOption).skip(skip).limit(limit);
    
    // Get unique categories for filter
    const categories = await Product.distinct('category');
    
    const totalPages = Math.ceil(totalProducts / limit);
    
    res.render('home', { 
      products,
      categories,
      filters: { search, category, minPrice, maxPrice, sort },
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.render('home', { 
      products: [], 
      categories: [],
      filters: {},
      error: 'Failed to load products' 
    });
  }
};

// Get single product details
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }

    // Get reviews for this product
    const Review = require('../models/Review');
    const reviews = await Review.find({ productId: product._id })
      .sort({ createdAt: -1 })
      .lean();

    res.render('product-detail', { product, reviews });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).render('error', { message: 'Failed to load product' });
  }
};

// Create new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, cost, imageUrl } = req.body;

    // Validation
    if (!name || !description || !price || !cost || !imageUrl) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (price < 0 || cost < 0) {
      return res.status(400).json({ success: false, error: 'Price and cost cannot be negative' });
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      cost: parseFloat(cost),
      imageUrl
    });

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, cost, imageUrl } = req.body;

    // Validation
    if (price < 0 || cost < 0) {
      return res.status(400).json({ success: false, error: 'Price and cost cannot be negative' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: parseFloat(price),
        cost: parseFloat(cost),
        imageUrl,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};
