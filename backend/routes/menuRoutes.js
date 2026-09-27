const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const requireAdmin = require('../middleware/auth');
const {
  getCategories,
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  setAvailability,
  deleteMenuItem,
} = require('../controllers/menuController');

const router = express.Router();

// ---- Public routes ----
router.get('/categories', getCategories);
router.get('/', getMenuItems);
router.get('/:id', [param('id').isInt()], validate, getMenuItemById);

// ---- Admin-only routes ----
const menuItemValidation = [
  body('category_id').isInt().withMessage('category_id must be an integer.'),
  body('name_en').trim().notEmpty().withMessage('English name is required.'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
];

router.post('/', requireAdmin, menuItemValidation, validate, createMenuItem);

router.put(
  '/:id',
  requireAdmin,
  [
    param('id').isInt(),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
    body('name_en').optional().trim().notEmpty().withMessage('English name cannot be empty.'),
  ],
  validate,
  updateMenuItem
);

router.patch(
  '/:id/availability',
  requireAdmin,
  [param('id').isInt(), body('is_available').isBoolean().withMessage('is_available must be true or false.')],
  validate,
  setAvailability
);

router.delete('/:id', requireAdmin, [param('id').isInt()], validate, deleteMenuItem);

module.exports = router;
