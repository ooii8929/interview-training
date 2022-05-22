const { UserFacingError } = require('./base_error');

class BadRequestError extends UserFacingError {
  constructor(message, reason) {
    super(message || "This page isn't working.", reason || 'Internal server error', 400);
  }
}

class NotFoundError extends UserFacingError {
  constructor(message, reason) {
    super(message || 'No page found.', reason || 'Internal server error', 404);
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
};
