const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

// Validation
const productValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Automotive', 'Food', 'Other'])
    .withMessage('Invalid category'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

// Routes
router.get('/categories', getCategories);
router.get('/', optionalAuth, getProducts);
router.get('/:id', optionalAuth, getProduct);
router.post('/', protect, upload.single('image'), productValidation, validate, createProduct);
router.put('/:id', protect, upload.single('image'), validate, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;