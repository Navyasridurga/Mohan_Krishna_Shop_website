const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { sendMessage } = require('../controllers/contactController');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters.'),
    body('phone').optional().trim(),
  ],
  validate,
  sendMessage
);

module.exports = router;
