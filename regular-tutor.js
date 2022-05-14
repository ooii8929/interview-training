require('dotenv').config();
const got = require('got');
const { pool } = require('./server/models/mysqlcon');
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds

const checkTime = async () => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // const questions = await conn.query('SELECT * FROM questions  WHERE profession = ? ORDER BY RAND() LIMIT 3', [profession]);

        // test no random
        const [questions] = await conn.query('SELECT * FROM teachers_time WHERE status = 0 ');

        let tmpTimeOutCourseId = [];
        questions.map((e) => {
            if (new Date(e.available_time) < Date.now()) {
                tmpTimeOutCourseId.push(e.id);
            }
        });

        console.log('tmpTimeOutCourseId', tmpTimeOutCourseId);
        const [updateResult] = await conn.query('UPDATE teachers_time SET status = 1 WHERE id in (?) ', [tmpTimeOutCourseId]);
        console.log('updateResult', updateResult);
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

checkTime();
