require('dotenv').config();
const got = require('got');
const { pool } = require('./mysqlcon');
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const axios = require('axios');

const getQuestions = async (profession) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const questions = await conn.query('SELECT * FROM questions');

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
};
