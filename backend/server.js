const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./utils/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const favoriteRoutes = require('./routes/favorites');

const app = express();

// Connect to MongoDB
connectDB();

/* ===============================
   CORS CONFIGURATION
================================= */

const allowedOrigins = [
  'http://localhost:5173',  // Vite (your frontend)
  'http://localhost:3000',  // CRA
  'http://localhost:19006', // Expo web
  'exp://localhost:19000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server-to-server

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/* ===============================
   MIDDLEWARE
================================= */

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ===============================
   ROUTES
================================= */

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/favorites', favoriteRoutes);

/* ===============================
   HEALTH CHECK
================================= */

app.get('/', (req, res) => {
  res.json({
    message: '🛍️ Micro Marketplace API is running!',
    version: '1.0.0'
  });
});

/* ===============================
   404 HANDLER
================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* ===============================
   GLOBAL ERROR HANDLER
================================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* ===============================
   START SERVER
================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
