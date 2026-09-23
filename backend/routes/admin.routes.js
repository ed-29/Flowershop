const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');
const { adminAuth } = require('../middleware/auth');

router.get('/users', adminAuth, controller.listUsers);
router.put('/users/:id/role', adminAuth, controller.updateUserRole);
router.delete('/users/:id', adminAuth, controller.deleteUser);
router.get('/orders', adminAuth, controller.listOrders);

module.exports = router;
