require('dotenv').config();
const got = require('got');
const { pool } = require('./mysqlcon');
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const axios = require('axios');

const getQuestions = async (profession) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // const questions = await conn.query('SELECT * FROM questions  WHERE profession = ? ORDER BY RAND() LIMIT 3', [profession]);

        // test no random
        const questions = await conn.query('SELECT * FROM questions  WHERE profession = ? AND id IN (2,4,5) ', [profession]);

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
        const questions = await conn.query('SELECT * FROM questions  WHERE id = ? ', [q_id]);

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
        const questions = await conn.query('SELECT * FROM questions_video WHERE profession = ?', [profession]);

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
    getQuestions,
    getVideoQuestions,
    getQuestionsByID,
};
