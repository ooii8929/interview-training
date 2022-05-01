require('dotenv').config();
const argon2 = require('argon2');
const got = require('got');
const { pool } = require('./mysqlcon');
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const jwt = require('jsonwebtoken');
const axios = require('axios');
const _ = require('lodash');

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

module.exports = {
    signUp,
    nativeSignIn,
    facebookSignIn,
    getUserProfileByEmail,
    getUserProfileByUserID,
};
