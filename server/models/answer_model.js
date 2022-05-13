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

const getUserProfile = async (userID) => {
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

const getAllTraining = async (user_id) => {
    // Get records
    const dbConnect = await dbo.getDb();

    let allTrainingResult = dbConnect
        .collection('training')
        .find({ user_id: Number(user_id) })
        .limit(50)
        .toArray();
    return allTrainingResult;
};

const getCourseResultByQid = async (userID) => {
    // Get records
    const dbConnect = dbo.getDb();
    try {
        const nowQuestionResult = await dbConnect
            .collection('training')
            .find({ user_id: Number(userID), status: 1 })
            .sort({ $natural: 1 })
            .toArray();
        console.log('nowQuestionResult', nowQuestionResult);
        return nowQuestionResult;
    } catch (err) {
        res.status(400).send(err);
    }
};

const questionByQid = async (user_id, question_id) => {
    // Get records
    const dbConnect = dbo.getDb();
    try {
        const questionResult = await dbConnect
            .collection('training')
            .find({ _id: ObjectId(question_id) })
            .toArray();
        console.log('questionResult', questionResult);
        return questionResult;
    } catch (err) {
        res.status(400).send(err);
    }
};

const getTutorTrainingRecords = async (user_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        let answer = {};
        const appointed = await pool.query(
            'SELECT tt.available_time, tt.status AS tutor_status,tt.course_url,ap.status AS apponintments_status,ap.update_dt,users.picture,users.name  FROM teachers_time tt INNER JOIN appointments ap ON tt.id = ap.teacher_time_id INNER JOIN users ON ap.user_id = users.id WHERE tt.t_id = ?',
            [user_id]
        );

        const unappointed = await pool.query('SELECT *  FROM teachers_time  WHERE t_id = ? AND status=0', [user_id]);

        answer.appointed = appointed[0];
        answer.unappointed = unappointed[0];
        await conn.query('COMMIT');
        return answer;
    } catch (e) {
        console.log(error);
        await conn.query('ROLLBACK');
        console.log('getTutorTrainingRecords error', e);
        return null;
    } finally {
        await conn.release();
    }

    // Get records
    const dbConnect = await dbo.getDb();

    let allTrainingResult = dbConnect.collection('training').find({ user_id: user_id }).limit(50).toArray();
    return allTrainingResult;
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
                    user_id: parseInt(user_id),
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
                    user_id: Number(user_id),
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
                user_id: Number(user_id),
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

const getCourseResultByQuestionID = async (question_id) => {
    try {
        // Get records
        const dbConnect = dbo.getDb();

        const questionResult = await dbConnect
            .collection('training')
            .find({ _id: ObjectId(question_id) })
            .toArray();
        console.log('questionResult', questionResult);
        return questionResult;
    } catch (err) {
        return { error: err };
    }
};

const endTraining = async (user_id, question_id) => {
    console.log('endTraining', user_id, question_id);
    // Get records
    const dbConnect = dbo.getDb();

    try {
        let endTrainingResult = await dbConnect.collection('training').updateOne(
            {
                user_id: Number(user_id),
                _id: ObjectId(question_id),
            },
            {
                $set: {
                    finished_dt: new Date(),
                    status: 1,
                },
            }
        );
        console.log('endTrainingResult', endTrainingResult);
        return { msg: endTrainingResult };
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
                user_id: Number(user_id),
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

    questionByQid,
    insertVideoAnswer,
    getAllTraining,
    insertCodeAnswer,
    submitVideoAnswer,
    submitVideoAnswerCheck,
    submitCodeAnswer,
    getTutorTrainingRecords,
    endTraining,
    getCourseResultByQid,
    getCourseResultByQuestionID,
};
