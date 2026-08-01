const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');
const { validateProduct } = require('../middleware/validation');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', auth, adminAuth, validateProduct, controller.create);
router.put('/:id', auth, adminAuth, validateProduct, controller.update);
router.delete('/:id', auth, adminAuth, controller.remove);

module.exports = router;
