require('dotenv').config();
const validator = require('validator');
const User = require('../models/user_model');
const { pool } = require('../models/mysqlcon');
const util = require('../util/util');
const _ = require('lodash');
const argon2 = require('argon2');
const dbo = require('../models/mongodbcon');

const getQuestionAnswer = async (questionID) => {
    try {
        const [answer] = await pool.query('SELECT * FROM questions WHERE id = ?', [questionID]);
        return answer[0];
    } catch (e) {
        return null;
    }
};

const getUserProfile = async (req, res) => {
    let { userID } = req.query;

    // Get records
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('profile')
        .find({ user_id: Number(userID) })
        .limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send('Error fetching listings!');
            } else {
                console.log('result', result);
                res.status(200).json(result);
            }
        });
};

const insertVideoAnswer = async (userID, question_id, video_answer) => {
    // Get records
    const dbConnect = dbo.getDb();
    try {
        dbConnect.collection('profile').insertOne({
            user_id: userID,
            question_id: question_id,
            video_answer: video_answer,
        });
        return { msg: 'success' };
    } catch (err) {
        res.status(400).send(err);
    }
};

const insertCodeAnswer = async (userID, question_id, code_answer, content) => {
    // Get records
    const dbConnect = dbo.getDb();
    try {
        dbConnect.collection('profile').insertOne({
            user_id: userID,
            question_id: question_id,
            create_dt: new Date(),
            content: content,
            code_answer: code_answer,
        });
        return { msg: 'success' };
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    getQuestionAnswer,
    getUserProfile,
    insertVideoAnswer,
    insertCodeAnswer,
};
