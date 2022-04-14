require('dotenv').config();
var ObjectId = require('mongodb').ObjectID;
// This will help us connect to the database
const dbo = require('../models/mongodbcon');

const getAllArticle = async (req, res) => {
    // Get records
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('article')
        .find({})
        .limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send('Error fetching listings!');
            } else {
                res.json(result);
            }
        });
};

module.exports = {
    getAllArticle,
};
