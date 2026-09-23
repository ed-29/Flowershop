const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');
const { validateProduct } = require('../middleware/validation');
const { staffAuth } = require('../middleware/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', staffAuth, controller.create);
router.put('/:id/availability', staffAuth, controller.setAvailability);
router.put('/:id', staffAuth, validateProduct, controller.update);
router.delete('/:id', staffAuth, controller.remove);

module.exports = router;
