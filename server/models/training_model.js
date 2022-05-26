require('dotenv').config();
const { pool } = require('./mysqlcon');
const dbo = require('../models/mongodbcon');
var ObjectId = require('mongodb').ObjectID;
const { MongodbError, MysqlError } = require('../util/error/database_error');

const getAllTrainingByUserId = async (user_id) => {
  try {
    // Get records
    const dbConnect = await dbo.getDb();

    let allTrainingResult = dbConnect
      .collection('training')
      .find({ user_id: Number(user_id) })
      .limit(50)
      .toArray();
    return allTrainingResult;
  } catch (error) {
    throw new MongodbError('[getAllTrainingByUserId]', error);
  }
};

const getExamInProgressBySessionId = async (userID) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    const nowQuestion = await dbConnect.collection('training').find({ user_id: userID, status: 0 }).toArray();
    return nowQuestion;
  } catch (error) {
    throw new MongodbError('[getAllTrainingByUserId]', error);
  }
};

const getVideoQuestions = async (profession) => {
  const conn = await pool.getConnection();
  try {
    // get video questions by profesiion and column not null
    const questions = await conn.query('SELECT * FROM questions_video WHERE profession = ? order by rand() limit 3;', [profession]);

    return questions;
  } catch (error) {
    throw new MysqlError('[getVideoQuestions]', error);
  }
};

const getCodeQuestions = async (profession) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    // test no random
    const questions = await conn.query('SELECT * FROM questions  WHERE profession = ? order by rand() limit 3;', [profession]);

    return questions;
  } catch (error) {
    throw new MysqlError('[getCodeQuestions]', error);
  }
};

const insertNewExamToTraining = async (profileQuestions) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    await dbConnect.collection('training').insertOne(profileQuestions);
    return { msg: 'success insert new profile training' };
  } catch (error) {
    throw new MongodbError('[insertNewExamToTraining]', error);
  }
};

const getQuestionsByID = async (q_id) => {
  const conn = await pool.getConnection();
  try {
    // test no random
    const [questions] = await conn.query('SELECT * FROM questions_video WHERE id = ? ', [q_id]);

    return questions;
  } catch (error) {
    throw new MysqlError('[getQuestionsByID]', error);
  }
};

const getCodeQuestionsByID = async (q_id) => {
  const conn = await pool.getConnection();
  try {
    // test no random
    const [questions] = await conn.query('SELECT * FROM questions WHERE id = ? ', [q_id]);

    return questions;
  } catch (error) {
    throw new MysqlError('[getCodeQuestionsByID]', error);
  }
};

const getTutorTrainingRecords = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    let answer = {};
    const appointed = await pool.query(
      'SELECT tt.available_time, tt.status AS tutor_status,tt.course_url,ap.status AS apponintments_status,ap.update_dt,users.picture,users.name  FROM tutors_time tt INNER JOIN appointments ap ON tt.id = ap.tutor_time_id INNER JOIN users ON ap.user_id = users.id WHERE tt.t_id = ?',
      [user_id]
    );

    const unappointed = await pool.query('SELECT * FROM tutors_time WHERE t_id = ? AND status=0', [user_id]);

    answer.appointed = appointed[0];
    answer.unappointed = unappointed[0];
    return answer;
  } catch (error) {
    throw new MysqlError('[getTutorTrainingRecords]', error);
  }
};

const getTrainingResultByQuestionID = async (question_id) => {
  try {
    // Get records
    const dbConnect = dbo.getDb();

    const questionResult = await dbConnect
      .collection('training')
      .find({ _id: ObjectId(question_id) })
      .toArray();
    return questionResult;
  } catch (error) {
    throw new MongodbError('[getTrainingResultByQuestionID]', error);
  }
};

const setTrainingFinish = async (user_id, question_id) => {
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
    return { msg: endTrainingResult };
  } catch (error) {
    throw new MongodbError('[setTrainingFinish]', error);
  }
};

const getTrainingResultByQid = async (userID) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    const nowQuestionResult = await dbConnect
      .collection('training')
      .find({ user_id: Number(userID), status: 1 })
      .sort({ $natural: 1 })
      .toArray();
    return nowQuestionResult;
  } catch (error) {
    throw new MongodbError('[getTrainingResultByQid]', error);
  }
};

module.exports = {
  getExamInProgressBySessionId,
  getVideoQuestions,
  getCodeQuestions,
  insertNewExamToTraining,
  getAllTrainingByUserId,
  getTutorTrainingRecords,
  getQuestionsByID,
  getTrainingResultByQuestionID,
  setTrainingFinish,
  getTrainingResultByQid,

  getCodeQuestionsByID,
};
