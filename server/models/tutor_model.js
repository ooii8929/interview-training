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

const getAllAppointmentByID = async (userID) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const userAppointments = await conn.query(
            'SELECT * FROM appointments INNER JOIN teachers_time ON appointments.teacher_time_id = teachers_time.id WHERE appointments.status = "0" AND appointments.user_id = ?',
            [userID]
        );
        console.log('userAppointments');
        console.log(userAppointments[0]);

        await conn.query('COMMIT');
        return userAppointments[0];
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
        const teacher_schedule_check = await conn.query('SELECT status,available_time FROM teachers_time WHERE id = ?', [teacher_time_id]);

        if (teacher_schedule_check[0].length !== 1) {
            await conn.query('COMMIT');
            return { error: 'These class cannot be appointed' };
        }

        // check user time if crashed
        let tutorTime = teacher_schedule_check[0][0]['available_time'];
        //add 30 minutes to date
        var minutesToAdd = 60;
        var currentDate = new Date(tutorTime);
        var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
        console.log('tutorTime', tutorTime);
        console.log('tutorTime + 10000', futureDate);
        const checkQueryStr =
            'SELECT a.* FROM appointments a INNER JOIN teachers_time tt ON  a.teacher_time_id = tt.id  WHERE a.user_id = ? AND tt.available_time >= ? AND tt.available_time <= ? ;';

        const user_schedule_check = await conn.query(checkQueryStr, [user_id, currentDate, futureDate]);
        if (user_schedule_check[0].length > 0) {
            return { error: 'You have already appointed tutor in this time' };
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
    getAllAppointmentByID,
};
