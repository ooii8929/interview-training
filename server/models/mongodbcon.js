require('dotenv').config();
const mysql = require('mysql2/promise');
const env = process.env.NODE_ENV || 'production';
const multipleStatements = process.env.NODE_ENV === 'test';
const { MONGODB_URL } = process.env;
const { MongoClient } = require('mongodb');
const client = new MongoClient(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
    connectToServer: function (callback) {
        client.connect(function (err, db) {
            if (err || !db) {
                return callback(err);
            }

            dbConnection = db.db('interview');
            console.log('Successfully connected to MongoDB.');

            return callback();
        });
    },

    getDb: function () {
        return dbConnection;
    },
};
