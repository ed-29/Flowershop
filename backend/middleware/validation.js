const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation
const validateUserRegistration = [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name').trim().isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['bouquets', 'arrangements', 'plants', 'occasions', 'seasonal']).withMessage('Invalid category'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('image').isURL().withMessage('Valid image URL required'),
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Valid product ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').notEmpty().withMessage('Street address required'),
  body('shippingAddress.city').notEmpty().withMessage('City required'),
  body('shippingAddress.state').notEmpty().withMessage('State required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('ZIP code required'),
  body('shippingAddress.country').notEmpty().withMessage('Country required'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'paypal', 'cash_on_delivery']).withMessage('Invalid payment method'),
  handleValidationErrors
];

// Review validation
const validateReview = [
  body('product').isMongoId().withMessage('Valid product ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10 }).withMessage('Review must be at least 10 characters'),
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateOrder,
  validateReview
};
