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

module.exports = {
    getQuestions,
};
