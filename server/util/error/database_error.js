const { DatabaseError } = require('./base_error');

class MongoDBError extends DatabaseError {
  constructor(message, reason) {
    super(message || "Couldn't find in mongodb.", reason || 'Internal server error', 500);
  }
}

class MysqlError extends DatabaseError {
  constructor(message, reason) {
    super(message || "Couldn't find in mysql.", reason || 'Internal server error', 500);
  }
}

module.exports = {
  MongoDBError,
  MysqlError,
};
