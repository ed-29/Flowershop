const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple request logger for debugging
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.log('[API]', req.method, req.path, 'bodyKeys:', Object.keys(req.body || {}));
  }
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Flower Shop API is running 🌸');
});

// Mount API routes
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const ordersRoutes = require('./routes/orders.routes');
const adminRoutes = require('./routes/admin.routes');
const usersRoutes = require('./routes/users.routes');
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);

// Simple 404 handler for API
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'Not found' });
  next();
});

// Error handler to log stack traces
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (req.path && req.path.startsWith('/api/')) {
    return res.status(500).json({ message: 'Server error', error: err && err.message ? err.message : String(err) });
  }
  next(err);
});

module.exports = app;
