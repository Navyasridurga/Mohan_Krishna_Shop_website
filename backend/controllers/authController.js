const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// POST /api/auth/login
// Body: { username, password }
// The admin password never leaves the server: we only compare a hash
// stored in the database and, on success, sign a short-lived JWT.
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin) {
    return next(new ApiError(401, 'Invalid username or password.'));
  }

  const isMatch = bcrypt.compareSync(password, admin.password_hash);
  if (!isMatch) {
    return next(new ApiError(401, 'Invalid username or password.'));
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  res.json({
    success: true,
    data: { token, admin: { id: admin.id, username: admin.username } },
  });
});

// GET /api/auth/me - lets the frontend verify a stored token is still valid
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

module.exports = { login, me };
