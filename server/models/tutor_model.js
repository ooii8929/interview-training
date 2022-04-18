require('dotenv').config();
const { pool } = require('./mysqlcon');

const createRoom = async (teacher_id, tutor_date_time, roomURL) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // check teacher schedule is existed in this time
        const teachers_schedule = await conn.query('SELECT * FROM teachers_time WHERE t_id = ? AND available_time =? AND status = 0', [teacher_id, tutor_date_time]);

        if (teachers_schedule[0].length > 0) {
            await conn.query('COMMIT');
            return { error: 'You are already appointed at the time' };
        }

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

        const teachers_schedule = await conn.query('SELECT * FROM teachers_time WHERE status = "0"');
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

const makeAppointment = async (teacher_time_id, user_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // check the course of teacher is existed and can be appointed
        const teacher_schedule_check = await conn.query('SELECT status FROM teachers_time WHERE id = ?', [teacher_time_id]);

        if (teacher_schedule_check[0].length !== 1) {
            await conn.query('COMMIT');
            return { error: 'These class cannot be appointed' };
        }

        const appoint = {
            user_id: user_id,
            teacher_time_id: teacher_time_id,
            status: 0,
        };

        const queryStr = 'INSERT INTO appointments SET ?';
        const [result] = await conn.query(queryStr, appoint);

        let updateStr = 'UPDATE teachers_time SET status = 1 WHERE id = ?';
        const [updateResult] = await conn.query(updateStr, [teacher_time_id]);
        console.log('updateResult', updateResult);

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

module.exports = {
    createRoom,
    getAllTeacherSchedule,
    makeAppointment,
};
