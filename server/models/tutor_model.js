require('dotenv').config();
const { pool } = require('./mysqlcon');

const createRoom = async (teacher_id, tutor_date_time, roomURL) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // check user exist
        const teachers_schedule = await conn.query('SELECT * FROM teachers_time WHERE t_id = ? AND status = 0', [teacher_id]);

        const appoint = {
            t_id: teacher_id,
            available_time: tutor_date_time,
            course_url: roomURL,
            status: 0,
        };

        const queryStr = 'INSERT INTO teachers_time SET ?';
        const [result] = await conn.query(queryStr, appoint);
        console.log(result);
        await conn.query('COMMIT');
        return { result };
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const getAllTeacherSchedule = async () => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const teachers_schedule = await conn.query('SELECT * FROM teachers_time WHERE status = 0');
        console.log('teachers_schedule');
        console.log(teachers_schedule[0]);

        await conn.query('COMMIT');
        return teachers_schedule[0];
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

module.exports = {
    createRoom,
    getAllTeacherSchedule,
};
