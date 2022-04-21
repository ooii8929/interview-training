require('dotenv').config();
const validator = require('validator');
const User = require('../models/user_model');
const { pool } = require('../models/mysqlcon');
const util = require('../util/util');
const _ = require('lodash');
const argon2 = require('argon2');
const dbo = require('../models/mongodbcon');

const getAllArticle = async () => {
    // Get records
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('interview')
        .find({})
        .limit(50)
        .toArray(function (err, result) {
            if (err) {
                return err;
            } else {
                return result;
            }
        });
};

const insertCodeArticle = async (postData) => {
    // Get records
    const dbConnect = dbo.getDb();

    let insertResult = dbConnect.collection('article').insertOne(postData);

    return insertResult;
};

const updateArticleGood = async (article_id, user_id) => {
    // Get records
    const dbConnect = dbo.getDb();

    let insertResult = dbConnect.collection('article').update({ id: article_id }, { $inc: { goods: 1 } });
    return insertResult;
};

module.exports = {
    insertCodeArticle,
    getAllArticle,
    updateArticleGood,
};
