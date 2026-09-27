const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const requireAdmin = require('../middleware/auth');
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

// Public - customer places an order
router.post(
  '/',
  [
    body('customer_name').trim().notEmpty().withMessage('Name is required.'),
    body('customer_phone')
      .trim()
      .matches(/^[0-9+\-\s]{7,15}$/)
      .withMessage('Enter a valid phone number.'),
    body('items').isArray({ min: 1 }).withMessage('Order must include at least one item.'),
    body('items.*.menu_item_id').isInt().withMessage('Each item needs a valid menu_item_id.'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item needs a quantity of at least 1.'),
  ],
  validate,
  createOrder
);

// Admin only
router.get('/', requireAdmin, getOrders);
router.get('/:id', requireAdmin, [param('id').isInt()], validate, getOrderById);
router.patch(
  '/:id/status',
  requireAdmin,
  [param('id').isInt(), body('status').trim().notEmpty()],
  validate,
  updateOrderStatus
);

module.exports = router;
