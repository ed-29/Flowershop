const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

// Temporarily disable validation to diagnose 'next is not a function' error
router.post('/register', validateUserRegistration, controller.register);
router.post('/login', validateUserLogin, controller.login);
router.get('/profile', auth, controller.getProfile);
router.put('/profile', auth, controller.updateProfile);
router.put('/password', auth, controller.changePassword);

module.exports = router;
