require('dotenv').config();

const { pool } = require('./mysqlcon');
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const axios = require('axios');
const dbo = require('../models/mongodbcon');

const getCodeQuestions = async (profession) => {
  const conn = await pool.getConnection();
  try {
    const questions = await conn.query('SELECT * FROM questions  WHERE profession = ? order by rand() limit 3;', [profession]);
    return { questions };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const getQuestionsByID = async (q_id) => {
  const conn = await pool.getConnection();
  try {
    const [questions] = await conn.query('SELECT * FROM questions_video WHERE id = ? ', [q_id]);
    return questions;
  } catch (error) {
    console.log(error);

    return { error: error };
  }
};

const getCodeQuestionsByID = async (q_id) => {
  const conn = await pool.getConnection();
  try {
    // test no random
    const [questions] = await conn.query('SELECT * FROM questions WHERE id = ? ', [q_id]);

    return questions;
  } catch (error) {
    console.log(error);

    return { error: error };
  }
};

const getVideoQuestions = async (profession) => {
  const conn = await pool.getConnection();
  try {
    // get video questions by profesiion and column not null
    const questions = await conn.query('SELECT * FROM questions_video WHERE profession = ? order by rand() limit 3;', [profession]);

    return { questions };
  } catch (error) {
    console.log(error);

    return { error };
  }
};

const insertProfileTraining = async (profileQuestions) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    await dbConnect.collection('training').insertOne(profileQuestions);
    return { msg: 'success insert new profile training' };
  } catch (err) {
    return { error: 'error' };
  }
};

const checkProfileQuestions = async (userID) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    const nowQuestion = await dbConnect.collection('training').find({ user_id: userID, status: 0 }).toArray();
    console.log('db nowQuestion', nowQuestion);
    return nowQuestion;
  } catch (err) {
    return { error: 'error' };
  }
};

const insertLogicQuestion = async (title, description, answer) => {
  const conn = await pool.getConnection();
  try {
    let data = {
      title: title,
      description: description,
      answer: answer,
    };

    // get video questions by profesiion and column not null
    const questions = await conn.query('INSERT INTO questions_logic SET ? ', data);

    return { questions };
  } catch (error) {
    console.log(error);

    return { error };
  }
};

module.exports = {
  insertLogicQuestion,
  getCodeQuestions,
  getVideoQuestions,
  getQuestionsByID,
  insertProfileTraining,
  getCodeQuestionsByID,
  checkProfileQuestions,
};
