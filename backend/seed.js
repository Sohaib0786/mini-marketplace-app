require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/micro-marketplace';

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@marketplace.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Bob Smith',
    email: 'bob@marketplace.com',
    password: 'password123',
    role: 'user'
  }
];

const productData = [
  {
    title: 'Sony WH-1000XM5 Headphones',
    price: 349.99,
    description: 'Industry-leading noise canceling headphones with 30-hour battery life, crystal clear hands-free calling, and exceptional sound quality. Perfect for travel and work-from-home setups.',
    category: 'Electronics',
    stock: 25,
    rating: 4.8,
    numReviews: 2847,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    tags: ['headphones', 'noise-canceling', 'wireless', 'sony', 'audio']
  },
  {
    title: 'Minimalist Leather Wallet',
    price: 49.99,
    description: 'Slim genuine leather bifold wallet with RFID blocking technology. Holds up to 8 cards and cash. Handcrafted with premium full-grain leather that ages beautifully.',
    category: 'Clothing',
    stock: 100,
    rating: 4.6,
    numReviews: 1203,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
    tags: ['wallet', 'leather', 'minimalist', 'rfid', 'accessories']
  },
  {
    title: 'MacBook Pro M3 Stand',
    price: 89.99,
    description: 'Adjustable aluminum laptop stand with ergonomic height adjustment from 5-20 inches. Compatible with all laptops 11-17 inches. Improves airflow and posture. Includes cleaning cloth.',
    category: 'Electronics',
    stock: 60,
    rating: 4.7,
    numReviews: 876,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    tags: ['laptop-stand', 'ergonomic', 'aluminum', 'desk', 'productivity']
  },
  {
    title: 'Organic Cotton Yoga Mat',
    price: 79.99,
    description: 'Eco-friendly yoga mat made from natural rubber and organic cotton. Non-slip surface provides excellent grip. 6mm thick for joint protection. Includes carrying strap.',
    category: 'Sports',
    stock: 45,
    rating: 4.5,
    numReviews: 534,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
    tags: ['yoga', 'mat', 'organic', 'eco-friendly', 'fitness']
  },
  {
    title: 'Ceramic Pour-Over Coffee Set',
    price: 64.99,
    description: 'Handcrafted ceramic dripper with matching server. Brews 1-4 cups of exceptional pour-over coffee. Includes 40 bleached paper filters. Perfect for coffee enthusiasts.',
    category: 'Home & Garden',
    stock: 35,
    rating: 4.9,
    numReviews: 412,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80',
    tags: ['coffee', 'ceramic', 'pour-over', 'kitchen', 'handmade']
  },
  {
    title: 'Atomic Habits - James Clear',
    price: 18.99,
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. The #1 New York Times bestseller. Over 10 million copies sold worldwide. A practical guide to tiny changes that deliver remarkable results.',
    category: 'Books',
    stock: 200,
    rating: 4.9,
    numReviews: 45823,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
    tags: ['book', 'self-help', 'habits', 'productivity', 'bestseller']
  },
  {
    title: 'Wireless Mechanical Keyboard',
    price: 149.99,
    description: 'Compact 75% layout mechanical keyboard with hot-swappable switches. Bluetooth 5.0 connects up to 3 devices. 4000mAh battery lasts 2 weeks. PBT keycaps for durability.',
    category: 'Electronics',
    stock: 40,
    rating: 4.6,
    numReviews: 1087,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    tags: ['keyboard', 'mechanical', 'wireless', 'bluetooth', 'typing']
  },
  {
    title: 'Succulent Plant Collection',
    price: 34.99,
    description: 'Set of 6 unique live succulents in terracotta pots. Low maintenance, perfect for beginners. Each plant is hand-selected for quality. Includes care guide and fertilizer.',
    category: 'Home & Garden',
    stock: 50,
    rating: 4.4,
    numReviews: 289,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&q=80',
    tags: ['plants', 'succulents', 'home-decor', 'garden', 'gift']
  },
  {
    title: 'Stainless Steel Water Bottle',
    price: 39.99,
    description: 'Double-wall vacuum insulated bottle keeps drinks cold 24hrs and hot 12hrs. BPA-free 32oz capacity. Leak-proof lid. Includes straw and cleaning brush. Dishwasher safe.',
    category: 'Sports',
    stock: 120,
    rating: 4.7,
    numReviews: 3421,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    tags: ['water-bottle', 'insulated', 'stainless-steel', 'eco-friendly', 'sports']
  },
  {
    title: 'LEGO Architecture Skyline',
    price: 59.99,
    description: 'Build iconic city skylines with this detailed LEGO Architecture set. Features 598 pieces. Includes New York, Paris, London, and Tokyo landmarks. Perfect for ages 12+ and display.',
    category: 'Toys',
    stock: 30,
    rating: 4.8,
    numReviews: 756,
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=500&q=80',
    tags: ['lego', 'architecture', 'toys', 'building', 'collector']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`👥 Created ${createdUsers.length} users`);
    console.log('   📧 alice@marketplace.com / password123 (admin)');
    console.log('   📧 bob@marketplace.com / password123 (user)');

    // Create products with seller reference
    const products = productData.map((product, index) => ({
      ...product,
      seller: createdUsers[index % 2]._id
    }));

    const createdProducts = await Product.create(products);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Add some favorites for bob
    const bobUser = createdUsers[1];
    bobUser.favorites = [createdProducts[0]._id, createdProducts[4]._id, createdProducts[5]._id];
    await bobUser.save();
    console.log('❤️  Added favorites for bob');

    console.log('\n✨ Database seeded successfully!');
    console.log('🚀 Run: npm run dev\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();