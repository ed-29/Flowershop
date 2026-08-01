const mongoose = require('dotenv').config();
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@flowershop.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Create sample customer
    const customerUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'customer123',
      phone: '+1234567890',
      addresses: [{
        street: '123 Flower Street',
        city: 'Bloomington',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        isDefault: true
      }]
    });
    await customerUser.save();

    // Create sample products
    const products = [
      {
        name: 'Classic Rose Bouquet',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1561172938-eb3c3e91a5a5?w=400',
        description: 'Beautiful arrangement of fresh red roses, perfect for any occasion. Hand-tied with premium greenery.',
        category: 'bouquets',
        stock: 25,
        inSeason: true,
        featured: true,
        tags: ['roses', 'romantic', 'classic'],
        careInstructions: 'Trim stems and change water every 2 days. Keep away from direct sunlight.'
      },
      {
        name: 'Spring Garden Mix',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        description: 'Vibrant mix of seasonal spring flowers including tulips, daisies, and lilies.',
        category: 'bouquets',
        stock: 30,
        inSeason: true,
        featured: true,
        tags: ['spring', 'colorful', 'fresh'],
        careInstructions: 'Fresh water daily. Remove wilted blooms to encourage others.'
      },
      {
        name: 'Elegant Orchid Plant',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1458071103674-cbe3c07ffb8c?w=400',
        description: 'Stunning phalaenopsis orchid in a decorative pot. Long-lasting beauty for home or office.',
        category: 'plants',
        stock: 15,
        inSeason: true,
        featured: false,
        tags: ['orchid', 'elegant', 'long-lasting'],
        careInstructions: 'Water once a week. Indirect light. High humidity preferred.'
      },
      {
        name: 'Birthday Celebration',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3853d?w=400',
        description: 'Festive arrangement perfect for birthdays with bright colors and party elements.',
        category: 'occasions',
        stock: 20,
        inSeason: true,
        featured: false,
        tags: ['birthday', 'celebration', 'colorful'],
        careInstructions: 'Keep hydrated. Remove party elements before placing in water.'
      },
      {
        name: 'Autumn Harvest',
        price: 44.99,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        description: 'Warm autumn colors with sunflowers, chrysanthemums, and seasonal foliage.',
        category: 'seasonal',
        stock: 18,
        inSeason: false,
        featured: false,
        tags: ['autumn', 'warm', 'harvest'],
        careInstructions: 'Seasonal arrangement. Best in fall months.'
      },
      {
        name: 'Lily Paradise',
        price: 54.99,
        image: 'https://images.unsplash.com/photo-1536049794559-4a90a601d9b7?w=400',
        description: 'Elegant white and pink lilies with baby\'s breath and premium greenery.',
        category: 'arrangements',
        stock: 22,
        inSeason: true,
        featured: true,
        tags: ['lilies', 'elegant', 'white'],
        careInstructions: 'Remove pollen stamens to extend vase life. Fresh water every 2 days.'
      },
      {
        name: 'Valentine Special',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1519378058457-d4b9ece8ba7d?w=400',
        description: 'Romantic arrangement of red roses, carnations, and delicate fillers for Valentine\'s Day.',
        category: 'occasions',
        stock: 12,
        inSeason: true,
        featured: false,
        tags: ['valentine', 'romantic', 'roses'],
        careInstructions: 'Handle with care. Roses are delicate. Keep in cool location.'
      },
      {
        name: 'Succulent Garden',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400',
        description: 'Low-maintenance succulent arrangement in modern ceramic planter.',
        category: 'plants',
        stock: 35,
        inSeason: true,
        featured: false,
        tags: ['succulent', 'modern', 'easy-care'],
        careInstructions: 'Water sparingly. Bright indirect light. Well-draining soil.'
      }
    ];

    await Product.insertMany(products);

    console.log('✅ Seed data created successfully!');
    console.log('👤 Admin user: admin@flowershop.com / admin123');
    console.log('👤 Customer user: john@example.com / customer123');
    console.log('🌸 Sample products created:', products.length);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
