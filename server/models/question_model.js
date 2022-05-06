require('dotenv').config();
const got = require('got');
const { pool } = require('./mysqlcon');
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const axios = require('axios');
const dbo = require('../models/mongodbcon');

const getCodeQuestions = async (profession) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // const questions = await conn.query('SELECT * FROM questions  WHERE profession = ? ORDER BY RAND() LIMIT 3', [profession]);

        // test no random
        const questions = await conn.query('SELECT * FROM questions  WHERE profession = ? order by rand() limit 3;', [profession]);

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

const getQuestionsByID = async (q_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // test no random
        const questions = await conn.query('SELECT * FROM questions WHERE id = ? ', [q_id]);

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

const getVideoQuestions = async (profession) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // get video questions by profesiion and column not null
        const questions = await conn.query('SELECT * FROM questions_video WHERE profession = ? order by rand() limit 3;', [profession]);

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

const insertProfileTraining = async (profileQuestions) => {
    // Get records
    const dbConnect = dbo.getDb();
    try {
        await dbConnect.collection('training').insertOne(profileQuestions);
        return { msg: 'success insert new profile training' };
    } catch (err) {
        res.status(400).send(err);
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
        res.status(400).send(err);
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
    insertLogicQuestion,
    getCodeQuestions,
    getVideoQuestions,
    getQuestionsByID,
    insertProfileTraining,

    checkProfileQuestions,
};
