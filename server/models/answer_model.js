require('dotenv').config();
const validator = require('validator');
const User = require('../models/user_model');
const { pool } = require('../models/mysqlcon');
const util = require('../util/util');
const _ = require('lodash');
const argon2 = require('argon2');
const dbo = require('../models/mongodbcon');
var ObjectId = require('mongodb').ObjectID;

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
                res.status(200).json(result);
            }
        });
};

const insertVideoAnswer = async (user_id, question_id, videoAnswer, checked) => {
    // Get records
    const dbConnect = dbo.getDb();
    try {
        dbConnect.collection('profile').insertOne({
            user_id: user_id,
            question_id: question_id,
            video_answer: videoAnswer,
            checked: checked,
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

const submitCodeAnswer = async (user_id, question_id, qid, language, code_answer, content) => {
    console.log('submitVideoAnswer model', user_id, question_id, qid, language, code_answer, content);
    // Get records
    const dbConnect = dbo.getDb();
    if (language == 'javascript') {
        try {
            let updateAnswer = await dbConnect.collection('training').updateOne(
                {
                    user_id: `${user_id}`,
                    _id: ObjectId(question_id),
                },
                {
                    $set: {
                        'code.$[c].javascript_answer': content,
                        'code.$[c].javascript_answer_status': code_answer,
                        'code.$[c].status': 1,
                    },
                },
                {
                    multi: true,
                    arrayFilters: [
                        {
                            'c.qid': qid,
                        },
                    ],
                }
            );
            console.log('updateAnswer', updateAnswer);
            return { msg: updateAnswer };
        } catch (err) {
            console.log('err', err);
            return { err: err };
        }
    } else if (language == 'python') {
        try {
            let updateAnswer = await dbConnect.collection('training').updateOne(
                {
                    user_id: `${user_id}`,
                    _id: ObjectId(question_id),
                },
                {
                    $set: {
                        'code.$[c].python_answer': content,
                        'code.$[c].python_answer_status': code_answer,
                        'code.$[c].status': 1,
                    },
                },
                {
                    multi: true,
                    arrayFilters: [
                        {
                            'c.qid': qid,
                        },
                    ],
                }
            );
            console.log('updateAnswer', updateAnswer);
            return { msg: updateAnswer };
        } catch (err) {
            console.log('err', err);
            return { err: err };
        }
    }
};

const submitVideoAnswer = async (user_id, question_id, qid, answer_url) => {
    console.log('submitVideoAnswer model', user_id, question_id, qid, answer_url);
    // Get records
    const dbConnect = dbo.getDb();

    try {
        let updateAnswer = await dbConnect.collection('training').updateOne(
            {
                user_id: `${user_id}`,
                _id: ObjectId(question_id),
            },
            {
                $set: {
                    'video.$[c].answer_url': answer_url,
                    'video.$[c].status': 1,
                },
            },
            {
                multi: true,
                arrayFilters: [
                    {
                        'c.qid': qid,
                    },
                ],
            }
        );
        console.log('updateAnswer', updateAnswer);
        return { msg: updateAnswer };
    } catch (err) {
        console.log('err', err);
        return { err: err };
    }
};

const submitVideoAnswerCheck = async (user_id, question_id, qid, checked) => {
    // Get records
    const dbConnect = dbo.getDb();

    try {
        let updateAnswer = await dbConnect.collection('training').updateOne(
            {
                user_id: `${user_id}`,
                _id: ObjectId(question_id),
            },
            {
                $set: {
                    'video.$[c].checked': checked,
                },
            },
            {
                multi: true,
                arrayFilters: [
                    {
                        'c.qid': qid,
                    },
                ],
            }
        );
        console.log('updateAnswer', updateAnswer);
        return { msg: updateAnswer };
    } catch (err) {
        console.log('err', err);
        return { err: err };
    }
};

module.exports = {
    getQuestionAnswer,
    getUserProfile,
    insertVideoAnswer,
    insertCodeAnswer,
    submitVideoAnswer,
    submitVideoAnswerCheck,
    submitCodeAnswer,
};
