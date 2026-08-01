const express = require('express');
const router = express.Router();
const controller = require('../controllers/orders.controller');
const { auth } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

router.post('/', auth, validateOrder, controller.createOrder);
router.get('/', auth, controller.getOrders);
router.get('/:id', auth, controller.getOrderById);
router.put('/:id/status', auth, controller.updateOrderStatus);
router.put('/:id/cancel', auth, controller.cancelOrder);

module.exports = router;
