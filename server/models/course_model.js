require('dotenv').config();
const { pool } = require('./mysqlcon');

const getAllTutorSchedule = async () => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const tutors_schedule = await conn.query(
            'SELECT tt.id,tt.t_id,tt.available_time,tt.course_url,ts.experience1,ts.experience2,ts.experience3,ts.introduce,ts.profession,ts.name,ts.picture FROM tutors_time AS tt INNER JOIN tutors AS ts ON ts.id = tt.t_id WHERE tt.status = "0"'
        );
        await conn.query('COMMIT');
        return tutors_schedule[0];
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const updateTutorSchedule = async (tutor_id, tutor_date_time, roomURL) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // check tutor schedule is existed in this time
        const checkSchedule = await conn.query('SELECT * FROM tutors_time WHERE t_id = ? AND available_time =? AND status = 0', [tutor_id, tutor_date_time]);

        if (checkSchedule[0].length > 0) {
            await conn.query('COMMIT');
            return { error: 'You are already appointed at the time' };
        }

        const appoint = {
            t_id: tutor_id,
            available_time: tutor_date_time,
            course_url: roomURL,
            status: 0,
        };

        const queryStr = 'INSERT INTO tutors_time SET ?';
        const [result] = await conn.query(queryStr, appoint);

        await conn.query('COMMIT');
        return { result };
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const makeAppointment = async (tutor_time_id, user_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        // check the course of tutor is existed and can be appointed
        const tutorScheduleCheck = await conn.query('SELECT status,available_time FROM tutors_time WHERE id = ?', [tutor_time_id]);

        if (tutorScheduleCheck[0].length !== 1) {
            await conn.query('COMMIT');
            return { error: 'These class cannot be appointed' };
        }

        const authCheck = await conn.query('SELECT id,email FROM users WHERE id = ?', [user_id]);

        if (authCheck[0].length !== 1) {
            await conn.query('COMMIT');
            return { error: '你必須為學生身份才可以預約課程' };
        }

        // check user time if crashed
        let tutorTime = tutorScheduleCheck[0][0]['available_time'];
        //add 30 minutes to date
        var minutesToAdd = 60;
        var currentDate = new Date(tutorTime);
        var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);

        const checkQueryStr =
            'SELECT a.* FROM appointments a INNER JOIN tutors_time tt ON  a.tutor_time_id = tt.id  WHERE a.user_id = ? AND tt.available_time >= ? AND tt.available_time <= ? ;';

        const userScheduleCheck = await conn.query(checkQueryStr, [user_id, currentDate, futureDate]);
        if (userScheduleCheck[0].length > 0) {
            return { error: 'You have already appointed tutor in this time' };
        }

        const appoint = {
            user_id: user_id,
            tutor_time_id: tutor_time_id,
            status: 0,
        };

        const insertAppointmentQuery = 'INSERT INTO appointments SET ?';
        const [insertAppointmentResult] = await conn.query(insertAppointmentQuery, appoint);

        // Change Tutor Schedule Time
        let updateTutorScheduleQuery = 'UPDATE tutors_time SET status = 1 WHERE id = ?';
        await conn.query(updateTutorScheduleQuery, [tutor_time_id]);

        await conn.query('COMMIT');
        return { insertAppointmentResult };
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
            'SELECT * FROM appointments INNER JOIN tutors_time ON appointments.tutor_time_id = tutors_time.id  INNER JOIN tutors ON tutors_time.t_id = tutors.id  WHERE appointments.status = "0" AND appointments.user_id = ?',
            [userID]
        );

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

const setTutorInfomation = async (experience1, experience2, experience3, user_id, introduce, profession) => {
    console.log('settutorInfomation', experience1, experience2, experience3, user_id, introduce, profession);
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        let tutorInfo = {
            experience1: experience1,
            experience2: experience2,
            experience3: experience3,
            introduce: introduce,
            profession: profession,
        };

        const queryStr = 'UPDATE tutors  SET ? WHERE id = ?';

        const [result] = await conn.query(queryStr, [tutorInfo, user_id]);

        console.log('update result', result);

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

const getTutorInfomation = async (user_id) => {
    console.log('gettutorInfomation', user_id);
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const queryStr = 'SELECT * FROM tutors  WHERE id = ?';

        const [result] = await conn.query(queryStr, [user_id]);

        console.log('update result', result);

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
    getAllTutorSchedule,
    updateTutorSchedule,
    makeAppointment,
    getAllAppointmentByID,
    setTutorInfomation,
    getTutorInfomation,
};
