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
    if (identity == 'tutor') {
      updateAvatorResult = await conn.query('UPDATE tutors SET picture = ? WHERE id = ?', [picture, userID]);
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

const tutorSignUp = async (identity, name, email, password) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    let emails;

    // if tutor
    if (identity == 'tutor') {
      emails = await conn.query('SELECT email FROM tutors WHERE email = ? FOR UPDATE', [email]);
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

    const queryStr = 'INSERT INTO tutors SET ?';
    const [tutorResult] = await conn.query(queryStr, user);
    console.log('tutorResult', tutorResult);
    user.id = tutorResult.insertId;
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

const getUserAppointments = async (userID, userEmail) => {
  const conn = await pool.getConnection();

  const queryUserAppointments =
    'SELECT * FROM users INNER JOIN appointments ON users.id = appointments.user_id INNER JOIN tutors_time ON appointments.tutor_time_id = tutors_time.id INNER JOIN tutors ON tutors_time.t_id = tutors.id  WHERE users.email = ?';
  const [userAppointments] = await conn.query(queryUserAppointments, [userEmail]);

  return userAppointments;
};

const getUserProfileAndAppointments = async (userID, userEmail) => {
  const conn = await pool.getConnection();

  // get all professions
  const queryUserProfile = 'SELECT create_dt,email,id,last_login_dt,picture FROM users WHERE id = ?';
  const [userProfileResult] = await conn.query(queryUserProfile, [userID]);
  let userProfileCombine = { userProfile: userProfileResult[0] };

  // get all professions
  const queryUserAppointments =
    'SELECT * FROM users INNER JOIN appointments ON users.id = appointments.user_id INNER JOIN tutors_time ON appointments.tutor_time_id = tutors_time.id INNER JOIN tutors ON tutors_time.t_id = tutors.id  WHERE users.email = ?';
  const [userProfileResultAppointments] = await conn.query(queryUserAppointments, [userEmail]);

  userProfileCombine.appointments = userProfileResultAppointments;

  return userProfileCombine;
};

const getUserProfile = async (userID, userEmail) => {
  const conn = await pool.getConnection();

  // get all professions
  const queryUserProfile = 'SELECT * FROM users WHERE email = ?';
  const userProfileResult = await conn.query(queryUserProfile, [userEmail]);

  return userProfileResult;
};

const gettutorProfile = async (tutorID, userEmail) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    // get all tutor profile
    const querytutorProfile = 'SELECT * FROM tutors WHERE email = ?';
    const [tutorProfileResult] = await conn.query(querytutorProfile, [userEmail]);
    let tutorProfileCombine = { userProfile: tutorProfileResult[0] };

    // get all appointments
    const queryUserAppointments = 'SELECT * FROM appointments ap INNER JOIN tutors_time tt ON tt.id=ap.tutor_time_id INNER JOIN users ON users.id=ap.user_id WHERE tt.t_id = ?';
    const [userProfileResultAppointments] = await conn.query(queryUserAppointments, [tutorID]);
    tutorProfileCombine.appointments = userProfileResultAppointments;
    await conn.query('COMMIT');

    return tutorProfileCombine;
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log('error', error);
    return error;
  } finally {
    await conn.release();
  }
};

const signUpTotutor = async (name, email, password, experience1, experience2, experience3, introduce, profession, provider) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    // check tutor exist
    let [findtutorByEmail] = await conn.query('SELECT email FROM tutors WHERE email = ? FOR UPDATE', [email]);

    if (findtutorByEmail.length > 0) {
      await conn.query('COMMIT');
      return { error: 'Email Already Exists' };
    }

    // argon2 hash
    const hash = await argon2.hash(password);

    const user = {
      provider: provider,
      email: email,
      password: hash,
      name: name,
      picture: null,
      experience1: experience1,
      experience2: experience2,
      experience3: experience3,
      introduce: introduce,
    };

    // insert into tutors table

    const queryStr = 'INSERT INTO tutors SET ?';
    const [tutorResult] = await conn.query(queryStr, user);
    console.log(typeof profession);
    console.log([tutorResult['insertId'], profession.replace("'", '').split(',')]);
    // insert profession and tutor
    const queryInsertProfession = `INSERT INTO tutors_professions (profession_id,tutor_id)
        SELECT id,?
        FROM professions
        WHERE profession IN (?)`;
    await conn.query(queryInsertProfession, [tutorResult['insertId'], profession.replace("'", '').split(',')]);

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

const signUpToStudent = async (name, email, password) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    let emails = await conn.query('SELECT email FROM users WHERE email = ? FOR UPDATE', [email]);

    // check user exist
    if (emails[0].length > 0) {
      await conn.query('COMMIT');
      return { error: 'Email Already Exists' };
    }

    const hash = await argon2.hash(password);

    const user = {
      provider: 'native',
      email: email,
      password: hash,
      name: name,
      picture: null,
    };

    const queryStr = 'INSERT INTO users SET ?';
    const [result] = await conn.query(queryStr, user);

    console.log('result insert', result);
    user.id = result.insertId;

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

const nativetutorSignIn = async (email, password) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    const [users] = await conn.query('SELECT * FROM tutors WHERE email = ?', [email]);
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

const getUserProfileByUserID = async (userID, identity) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    let users;
    if (identity === 'tutor') {
      [users] = await pool.query('SELECT * FROM tutors WHERE id = ?', [userID]);
    }
    if (identity === 'student') {
      [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userID]);
    }

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
    return users;
  } catch (error) {
    await conn.query('ROLLBACK');
    return { error };
  } finally {
    await conn.release();
  }
};

module.exports = {
  signUpToStudent,
  signUpTotutor,
  nativeSignIn,
  facebookSignIn,
  tutorSignUp,
  getUserProfileAndAppointments,
  getUserProfileByEmail,
  getUserProfileByUserID,
  getUsersProfileByUserID,
  updateAvator,
  getUserProfile,
  getUserAppointments,
  nativetutorSignIn,
  gettutorProfile,
};
