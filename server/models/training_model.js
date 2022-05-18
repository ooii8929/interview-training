require('dotenv').config();
const { pool } = require('./mysqlcon');
const dbo = require('../models/mongodbcon');

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

const insertLogicQuestion = async (title, description, answer) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    let data = {
      title: title,
      description: description,
      answer: answer,
    };

    // get video questions by profesiion and column not null
    const questions = await conn.query('INSERT INTO questions_logic SET ? ', data);

    await conn.query('COMMIT');
    return { questions };
  } catch (error) {
    console.log(error);
    await conn.query('ROLLBACK');
    return { error };
  } finally {
    await conn.release();
  }
};

module.exports = {
  getExamInProgressBySessionId,
  getVideoQuestions,
  getCodeQuestions,
  insertNewExamToTraining,

  insertLogicQuestion,
  getQuestionsByID,

  getCodeQuestionsByID,
};
