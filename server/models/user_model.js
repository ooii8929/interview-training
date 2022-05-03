require('dotenv').config();
const argon2 = require('argon2');
const got = require('got');
const { pool } = require('./mysqlcon');
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const jwt = require('jsonwebtoken');
const axios = require('axios');
const _ = require('lodash');

const updateAvator = async (identity, userID, picture) => {
    console.log('info', identity, userID, picture);
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        let updateAvatorResult;
        if (identity == 'teacher') {
            updateAvatorResult = await conn.query('UPDATE teachers SET picture = ? WHERE id = ?', [picture, userID]);
        }
        if (identity == 'student') {
            updateAvatorResult = await conn.query('UPDATE users SET picture = ? WHERE id = ?', [picture, userID]);
        }
        console.log('updateAvator', updateAvatorResult);

        await conn.query('COMMIT');
        return updateAvatorResult;
    } catch (error) {
        await conn.query('ROLLBACK');

        console.log('updateAvator error', error);
        return error;
    } finally {
        await conn.release();
    }
};

const teacherSignUp = async (identity, name, email, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        let emails;

        // if teacher
        if (identity == 'teacher') {
            emails = await conn.query('SELECT email FROM teachers WHERE email = ? FOR UPDATE', [email]);
        }

        console.log('emails', emails);

        // check user exist
        if (emails[0].length > 0) {
            await conn.query('COMMIT');
            return { error: 'Email Already Exists' };
        }

        const loginAt = new Date();
        const hash = await argon2.hash(password);

        const user = {
            provider: 'native',
            email: email,
            password: hash,
            name: name,
            picture: null,
        };

        const queryStr = 'INSERT INTO teachers SET ?';
        const [teacherResult] = await conn.query(queryStr, user);
        console.log('teacherResult', teacherResult);
        user.id = teacherResult.insertId;
        await conn.query('COMMIT');
        return { user };
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const getUserProfile = async (userID, userEmail) => {
    const conn = await pool.getConnection();

    // get all professions
    const queryUserProfile = 'SELECT * FROM users WHERE email = ?';
    const [userProfileResult] = await conn.query(queryUserProfile, [userEmail]);
    let userProfileCombine = { userProfile: userProfileResult[0] };

    // get all professions
    const queryUserAppointments =
        'SELECT * FROM users INNER JOIN appointments ON users.id = appointments.user_id INNER JOIN teachers_time ON appointments.teacher_time_id = teachers_time.id INNER JOIN teachers ON teachers_time.t_id = teachers.id  WHERE users.email = ?';
    const [userProfileResultAppointments] = await conn.query(queryUserAppointments, [userEmail]);

    userProfileCombine.appointments = userProfileResultAppointments;

    return userProfileCombine;
};

const getUserPureProfile = async (userID, userEmail) => {
    const conn = await pool.getConnection();

    // get all professions
    const queryUserProfile = 'SELECT * FROM users WHERE email = ?';
    const userProfileResult = await conn.query(queryUserProfile, [userEmail]);

    return userProfileResult;
};

const getTeacherProfile = async (teacherID, userEmail) => {
    const conn = await pool.getConnection();

    // get all professions
    const queryTeacherProfile = 'SELECT * FROM teachers WHERE email = ?';
    const [teacherProfileResult] = await conn.query(queryTeacherProfile, [userEmail]);
    let teacherProfileCombine = { userProfile: teacherProfileResult[0] };

    // get all professions
    const queryUserAppointments = 'SELECT * FROM appointments WHERE teacher_time_id = ?';
    const [userProfileResultAppointments] = await conn.query(queryUserAppointments, [teacherID]);

    teacherProfileCombine.appointments = userProfileResultAppointments;

    console.log('teacherProfileCombine', teacherProfileCombine);

    return teacherProfileCombine;
};

const signUp = async (identity, name, email, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        let emails;
        // if student
        if (identity == 'student') {
            emails = await conn.query('SELECT email FROM users WHERE email = ? FOR UPDATE', [email]);
        }

        // if teacher
        if (identity == 'teacher') {
            emails = await conn.query('SELECT email FROM teachers WHERE email = ? FOR UPDATE', [email]);
        }

        console.log('emails', emails);

        // check user exist
        if (emails[0].length > 0) {
            await conn.query('COMMIT');
            return { error: 'Email Already Exists' };
        }

        const loginAt = new Date();
        const hash = await argon2.hash(password);

        const user = {
            provider: 'native',
            email: email,
            password: hash,
            name: name,
            picture: null,
        };

        // if student
        if (identity == 'student') {
            const queryStr = 'INSERT INTO users SET ?';
            const [result] = await conn.query(queryStr, user);

            user.id = result.insertId;
        }

        // if teacher
        if (identity == 'teacher') {
            const queryStr = 'INSERT INTO teachers SET ?';
            const [teacherResult] = await conn.query(queryStr, user);

            // get all professions
            const queryProfessions = 'SELECT * FROM professions WHERE profession IN (?)';
            const [professionsResult] = await conn.query(queryProfessions, [profession]);

            const allInsertTeacherProfession = [];

            console.log('professionsResult', professionsResult);

            professionsResult.forEach((e) => {
                const insertTeacherProfession = [];
                insertTeacherProfession.push(teacherResult.insertId);
                insertTeacherProfession.push(e.id);
                allInsertTeacherProfession.push(insertTeacherProfession);
            });

            console.log('allInsertTeacherProfession', allInsertTeacherProfession);

            // get all professions
            const insertTandP = 'INSERT INTO teachers_professions (teacher_id, profession_id) VALUES ?';
            const [insertTeacherProfessionResult] = await conn.query(insertTandP, [allInsertTeacherProfession]);

            user.id = teacherResult.insertId;
        }

        await conn.query('COMMIT');
        return { user };
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const nativeSignIn = async (email, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const [users] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        const auth = await argon2.verify(user.password, password);
        console.log(auth);
        if (!auth) {
            await conn.query('COMMIT');
            return { error: 'Password is wrong' };
        }

        const loginAt = new Date();

        const queryStr = 'UPDATE users SET last_login_dt = ? WHERE id = ?';
        await conn.query(queryStr, [loginAt, user.id]);

        await conn.query('COMMIT');

        return { user };
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const nativeTeacherSignIn = async (email, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const [users] = await conn.query('SELECT * FROM teachers WHERE email = ?', [email]);
        const user = users[0];

        const auth = await argon2.verify(user.password, password);
        console.log(auth);
        if (!auth) {
            await conn.query('COMMIT');
            return { error: 'Password is wrong' };
        }

        const loginAt = new Date();

        const queryStr = 'UPDATE users SET last_login_dt = ? WHERE id = ?';
        await conn.query(queryStr, [loginAt, user.id]);

        await conn.query('COMMIT');

        return { user };
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const facebookSignIn = async (id, name, email) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        const loginAt = new Date();
        let user = {
            provider: 'facebook',

            email: email,
            name: name,
            picture: 'https://graph.facebook.com/' + id + '/picture?type=large',
            access_expired: TOKEN_EXPIRE,
            login_at: loginAt,
        };
        const accessToken = jwt.sign(
            {
                provider: user.provider,
                name: user.name,
                email: user.email,
                picture: user.picture,
            },
            TOKEN_SECRET
        );
        user.access_token = accessToken;

        const [users] = await conn.query("SELECT id FROM users WHERE email = ? AND provider = 'facebook' FOR UPDATE", [email]);
        let userId;
        if (users.length === 0) {
            // Insert new user
            const queryStr = 'insert into user set ?';
            const [result] = await conn.query(queryStr, user);
            userId = result.insertId;
        } else {
            // Update existed user
            userId = users[0].id;
            const queryStr = 'UPDATE user SET access_token = ?, access_expired = ?, login_at = ?  WHERE id = ?';
            await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, userId]);
        }
        user.id = userId;

        await conn.query('COMMIT');

        return { user };
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const getUserProfileByEmail = async (email) => {
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return users[0];
    } catch (e) {
        return null;
    }
};

const getUserProfileByUserID = async (userID) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userID]);
        console.log('users', users);
        await conn.query('COMMIT');
        return users[0];
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const getUsersProfileByUserID = async (userID) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        const [users] = await pool.query('SELECT * FROM users WHERE id IN (?)', [userID]);
        console.log('users', users);
        await conn.query('COMMIT');
        return users[0];
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

module.exports = {
    signUp,
    nativeSignIn,
    facebookSignIn,
    teacherSignUp,
    getUserProfile,
    getUserProfileByEmail,
    getUserProfileByUserID,
    getUsersProfileByUserID,
    updateAvator,
    getUserPureProfile,
    nativeTeacherSignIn,
    getTeacherProfile,
};
