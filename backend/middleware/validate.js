const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Run after express-validator's chain of checks on a route.
// Collects all validation errors and returns a single 422 response.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ApiError(422, 'Validation failed', details));
  }
  next();
}

module.exports = validate;
