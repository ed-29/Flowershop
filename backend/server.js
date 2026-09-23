require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');

const ensureDefaultUsers = async () => {
  const defaults = [
    { firstName: 'Admin', lastName: 'User', email: 'admin@flowershop.com', password: 'admin123', role: 'admin' },
    { firstName: 'Employee', lastName: 'User', email: 'employee@flowershop.com', password: 'employee123', role: 'employee' },
    { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'customer123', role: 'customer' }
  ];

  for (const userData of defaults) {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (!existingUser) {
      const user = new User(userData);
      await user.save();
      console.log(`Created default ${userData.role}: ${userData.email}`);
    }
  }
};

const startServer = async () => {
  await connectDB();
  await ensureDefaultUsers();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
