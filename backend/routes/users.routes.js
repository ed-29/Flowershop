const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Append an activity record to the current user
router.post('/activity', auth, async (req, res) => {
  try {
    const { type, message, meta } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.activity = user.activity || [];
    user.activity.push({ type, message, meta });
    await user.save();
    res.json({ message: 'Activity recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
