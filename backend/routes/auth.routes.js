const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

router.post('/register', validateUserRegistration, controller.register);
router.post('/login', validateUserLogin, controller.login);
router.get('/profile', auth, controller.getProfile);
router.put('/profile', auth, controller.updateProfile);

module.exports = router;
