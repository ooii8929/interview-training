const { DatabaseError } = require('./base_error');

class MongoDBError extends DatabaseError {
  constructor(message, status) {
    super(message || "Couldn't find in mongodb.", status || 500);
  }
}

class MysqlError extends DatabaseError {
  constructor(message, status) {
    super(message || "Couldn't find in mysql.", status || 500);
  }
}

module.exports = {
  MongoDBError,
  MysqlError,
};
