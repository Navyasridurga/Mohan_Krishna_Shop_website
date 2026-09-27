const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// Protects admin-only routes. Expects "Authorization: Bearer <token>".
// The token is issued only by POST /api/auth/login and never contains
// or exposes the admin password - only { id, username }.
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: payload.id, username: payload.username };
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired session. Please log in again.'));
  }
}

module.exports = requireAdmin;
