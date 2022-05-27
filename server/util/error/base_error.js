'use strict';

// Here is the base error classes to extend from

class ApplicationError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message || 'Internal Server Error';

    this.status = status || 500;

    this.Datetime = new Date();
  }
}

class DatabaseError extends ApplicationError {}

class UserFacingError extends ApplicationError {}

module.exports = {
  ApplicationError,
  DatabaseError,
  UserFacingError,
};
