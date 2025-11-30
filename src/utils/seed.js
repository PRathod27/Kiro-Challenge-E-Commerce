require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = new User({
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');

    // Create sample products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        cost: 45.00,
        category: 'Electronics',
        rating: 4.5,
        reviewCount: 128,
        stock: 50,
        lowStockThreshold: 10,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with fitness tracking',
        price: 199.99,
        cost: 95.00,
        category: 'Electronics',
        rating: 4.7,
        reviewCount: 95,
        stock: 30,
        lowStockThreshold: 10,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
      },
      {
        name: 'Laptop Backpack',
        description: 'Durable backpack with laptop compartment',
        price: 49.99,
        cost: 20.00,
        category: 'Accessories',
        rating: 4.3,
        reviewCount: 67,
        stock: 75,
        lowStockThreshold: 15,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable speaker with excellent sound quality',
        price: 79.99,
        cost: 35.00,
        category: 'Electronics',
        rating: 4.6,
        reviewCount: 142,
        stock: 8,
        lowStockThreshold: 10,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'
      },
      {
        name: 'USB-C Cable',
        description: 'Fast charging USB-C cable, 6ft length',
        price: 14.99,
        cost: 5.00,
        category: 'Accessories',
        rating: 4.2,
        reviewCount: 203,
        stock: 150,
        lowStockThreshold: 20,
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500'
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 29.99,
        cost: 12.00,
        category: 'Electronics',
        rating: 4.4,
        reviewCount: 89,
        stock: 45,
        lowStockThreshold: 10,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
      }
    ];

    await Product.insertMany(products);
    console.log('Sample products created');

    console.log('\n=== Seed Data Summary ===');
    console.log(`Admin Email: ${admin.email}`);
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`Products Created: ${products.length}`);
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
