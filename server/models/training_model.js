require('dotenv').config();
const { pool } = require('./mysqlcon');
const dbo = require('../models/mongodbcon');
var ObjectId = require('mongodb').ObjectID;

const getAllTrainingByUserId = async (user_id) => {
  // Get records
  const dbConnect = await dbo.getDb();

  let allTrainingResult = dbConnect
    .collection('training')
    .find({ user_id: Number(user_id) })
    .limit(50)
    .toArray();
  return allTrainingResult;
};

const getExamInProgressBySessionId = async (userID) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    const nowQuestion = await dbConnect.collection('training').find({ user_id: userID, status: 0 }).toArray();
    return nowQuestion;
  } catch (err) {
    return { error: err };
  }
};

const getVideoQuestions = async (profession) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    // get video questions by profesiion and column not null
    const questions = await conn.query('SELECT * FROM questions_video WHERE profession = ? order by rand() limit 3;', [profession]);

    await conn.query('COMMIT');
    return questions;
  } catch (error) {
    console.log(error);
    await conn.query('ROLLBACK');
    return { error };
  } finally {
    await conn.release();
  }
};

const getCodeQuestions = async (profession) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    // const questions = await conn.query('SELECT * FROM questions  WHERE profession = ? ORDER BY RAND() LIMIT 3', [profession]);

    // test no random
    const questions = await conn.query('SELECT * FROM questions  WHERE profession = ? order by rand() limit 3;', [profession]);

    await conn.query('COMMIT');
    return questions;
  } catch (error) {
    console.log(error);
    await conn.query('ROLLBACK');
    return { error };
  } finally {
    await conn.release();
  }
};

const insertNewExamToTraining = async (profileQuestions) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    await dbConnect.collection('training').insertOne(profileQuestions);
    return { msg: 'success insert new profile training' };
  } catch (err) {
    return { error: err };
  }
};

const getQuestionsByID = async (q_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    // test no random
    const [questions] = await conn.query('SELECT * FROM questions_video WHERE id = ? ', [q_id]);

    await conn.query('COMMIT');
    return questions;
  } catch (error) {
    console.log(error);
    await conn.query('ROLLBACK');
    return { error: error };
  } finally {
    await conn.release();
  }
};

const getCodeQuestionsByID = async (q_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    // test no random
    const [questions] = await conn.query('SELECT * FROM questions WHERE id = ? ', [q_id]);

    await conn.query('COMMIT');
    return questions;
  } catch (error) {
    console.log(error);
    await conn.query('ROLLBACK');
    return { error: error };
  } finally {
    await conn.release();
  }
};

const getTutorTrainingRecords = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    let answer = {};
    const appointed = await pool.query(
      'SELECT tt.available_time, tt.status AS tutor_status,tt.course_url,ap.status AS apponintments_status,ap.update_dt,users.picture,users.name  FROM tutors_time tt INNER JOIN appointments ap ON tt.id = ap.tutor_time_id INNER JOIN users ON ap.user_id = users.id WHERE tt.t_id = ?',
      [user_id]
    );

    const unappointed = await pool.query('SELECT *  FROM tutors_time  WHERE t_id = ? AND status=0', [user_id]);

    answer.appointed = appointed[0];
    answer.unappointed = unappointed[0];
    await conn.query('COMMIT');
    return answer;
  } catch (e) {
    await conn.query('ROLLBACK');
    return null;
  } finally {
    await conn.release();
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
  } catch (err) {
    return { error: err };
  }
};

const setTrainingFinish = async (user_id, question_id) => {
  console.log('setTrainingFinish', user_id, question_id);
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
  } catch (err) {
    return { error: 'error' };
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
