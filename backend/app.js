const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Flower Shop API is running 🌸');
});

// Mount API routes
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const ordersRoutes = require('./routes/orders.routes');
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// Simple 404 handler for API
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'Not found' });
  next();
});

module.exports = app;
