const ApiError = require('../utils/ApiError');

// 404 handler - runs when no route matched
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Final error handler - always returns a consistent JSON shape
// { success: false, message, details? }
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  // better-sqlite3 constraint errors
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    statusCode = 409;
    message = 'This record already exists.';
  } else if (err.code && err.code.startsWith('SQLITE_')) {
    statusCode = 400;
    message = 'Database error processing request.';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}

module.exports = { notFound, errorHandler };
