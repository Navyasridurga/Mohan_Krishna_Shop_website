const { db } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/contact - public
const sendMessage = asyncHandler(async (req, res) => {
  const { name, phone, message } = req.body;
  const result = db
    .prepare('INSERT INTO contact_messages (name, phone, message) VALUES (?, ?, ?)')
    .run(name, phone || null, message);

  res.status(201).json({
    success: true,
    message: 'Thank you, we received your message and will get back to you soon.',
    data: { id: result.lastInsertRowid },
  });
});

// GET /api/reviews - public, published only
const getReviews = asyncHandler(async (req, res) => {
  const reviews = db
    .prepare('SELECT id, customer_name, rating, comment, created_at FROM reviews WHERE is_published = 1 ORDER BY created_at DESC')
    .all();
  res.json({ success: true, data: reviews });
});

module.exports = { sendMessage, getReviews };
