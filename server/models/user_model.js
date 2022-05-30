require('dotenv').config();
const argon2 = require('argon2');
const { pool } = require('./mysqlcon');
const dbo = require('../models/mongodbcon');
const { MongodbError, MysqlError } = require('../util/error/database_error');
const { BadRequestError } = require('../util/error/user_error');

const updateAvator = async (identity, userID, picture) => {
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

    await conn.query('COMMIT');
    return updateAvatorResult;
  } catch (error) {
    await conn.query('ROLLBACK');
    throw new MysqlError('[updateAvator]', error);
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
      throw new MysqlError('[tutorSignUp]', { error: 'Email Already Exists' });
    }

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
    user.id = tutorResult.insertId;
    await conn.query('COMMIT');
    return { user };
  } catch (error) {
    await conn.query('ROLLBACK');
    throw new MysqlError('[tutorSignUp]', error);
  } finally {
    await conn.release();
  }
};

const getUserAppointments = async (userID, userEmail) => {
  try {
    const conn = await pool.getConnection();

    const queryUserAppointments =
      'SELECT * FROM users INNER JOIN appointments ON users.id = appointments.user_id INNER JOIN tutors_time ON appointments.tutor_time_id = tutors_time.id INNER JOIN tutors ON tutors_time.t_id = tutors.id  WHERE users.email = ?';
    const [userAppointments] = await conn.query(queryUserAppointments, [userEmail]);

    return userAppointments;
  } catch (error) {
    throw new MysqlError('[getUserAppointments]', error);
  }
};

const getUserProfileAndAppointments = async (userID, userEmail) => {
  try {
    const conn = await pool.getConnection();

    // get all professions
    const queryUserProfile = 'SELECT create_dt,email,id,last_login_dt,picture FROM users WHERE id = ?';
    const [userProfileResult] = await conn.query(queryUserProfile, [userID]);
    let userProfileCombine = { userProfile: userProfileResult[0] };

    // get all appointments
    const queryUserAppointments =
      'SELECT * FROM users INNER JOIN appointments ON users.id = appointments.user_id INNER JOIN tutors_time ON appointments.tutor_time_id = tutors_time.id INNER JOIN tutors ON tutors_time.t_id = tutors.id  WHERE users.email = ?';
    const [userProfileResultAppointments] = await conn.query(queryUserAppointments, [userEmail]);

    userProfileCombine.appointments = userProfileResultAppointments;

    return userProfileCombine;
  } catch (error) {
    throw new MysqlError('[getUserProfileAndAppointments]', error);
  }
};

const getUserProfileByUserId = async (userID) => {
  try {
    const conn = await pool.getConnection();

    // get all professions
    const queryUserProfile = 'SELECT * FROM users WHERE id = ?';
    const userProfileResult = await conn.query(queryUserProfile, [userID]);

    return userProfileResult;
  } catch (error) {
    throw new MysqlError('[getUserProfileByUserId]', error);
  }
};

const getUserProfileByUserEmail = async (userEmail) => {
  try {
    const conn = await pool.getConnection();

    // get all professions
    const queryUserProfile = 'SELECT * FROM users WHERE email = ?';
    const userProfileResult = await conn.query(queryUserProfile, [userEmail]);

    return userProfileResult;
  } catch (error) {
    throw new MysqlError('[getUserProfileByUserEmail]', error);
  }
};

const getTutorProfile = async (tutorID, userEmail) => {
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
    throw new MysqlError('[getTutorProfile]', error);
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
      return new BadRequestError({ error: 'Email Already Exists' }, 400);
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
    // insert profession and tutor
    const queryInsertProfession = `INSERT INTO tutors_professions (profession_id,tutor_id)
        SELECT id,?
        FROM professions
        WHERE profession IN (?)`;
    await conn.query(queryInsertProfession, [tutorResult['insertId'], profession.replace("'", '').split(',')]);

    await conn.query('COMMIT');
    return { user };
  } catch (error) {
    await conn.query('ROLLBACK');
    throw new MysqlError('[signUpTotutor]', error);
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
      return new BadRequestError({ error: 'Email Already Exists' }, 400);
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
    throw new MysqlError('[signUpToStudent]', error);
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
      throw new BadRequestError('[signUpTotutor]', { error: 'Password is wrong' });
    }

    const loginAt = new Date();

    const queryStr = 'UPDATE users SET last_login_dt = ? WHERE id = ?';
    await conn.query(queryStr, [loginAt, user.id]);

    await conn.query('COMMIT');

    return { user };
  } catch (error) {
    await conn.query('ROLLBACK');
    throw new MysqlError('[nativeSignIn]', error);
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
      throw new BadRequestError('[signUpTotutor]', { error: 'Password is wrong' });
    }

    const loginAt = new Date();

    const queryStr = 'UPDATE users SET last_login_dt = ? WHERE id = ?';
    await conn.query(queryStr, [loginAt, user.id]);

    await conn.query('COMMIT');

    return { user };
  } catch (error) {
    await conn.query('ROLLBACK');
    throw new MysqlError('[nativetutorSignIn]', error);
  } finally {
    await conn.release();
  }
};

const getUserProfileByEmail = async (email) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0];
  } catch (error) {
    throw new MysqlError('[nativetutorSignIn]', error);
  }
};

const getUserProfileByUserID = async (userID, identity, email) => {
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

    await conn.query('COMMIT');
    return users[0];
  } catch (error) {
    await conn.query('ROLLBACK');
    throw new MysqlError('[getUserProfileByUserID]', error);
  } finally {
    await conn.release();
  }
};

const getUsersProfileByUserID = async (userID) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id IN (?)', [userID]);

    return users;
  } catch (error) {
    throw new MysqlError('[getUsersProfileByUserID]', error);
  }
};

const getUserCodeLog = async (question_id, user_id) => {
  try {
    // Get records
    const dbConnect = dbo.getDb();

    dbConnect
      .collection('profile')
      .find({ user_id: user_id, question_id: parseInt(question_id) })
      .limit(50)
      .sort({ create_dt: -1 })
      .toArray(function (err, result) {
        if (err) {
          // return res.status(400).send({ error: 'Error fetching listings!' });
        } else {
          return result;
          //  return res.status(500).send({ error: 'server error' });
        }
      });
  } catch (error) {
    throw new MongodbError('[getUserCodeLog]', error);
  }
};

module.exports = {
  signUpToStudent,
  signUpTotutor,
  nativeSignIn,
  tutorSignUp,
  getUserProfileAndAppointments,
  getUserProfileByEmail,
  getUserProfileByUserID,
  getUsersProfileByUserID,
  updateAvator,
  getUserProfileByUserId,
  getUserProfileByUserEmail,
  getUserAppointments,
  nativetutorSignIn,
  getTutorProfile,
  getUserCodeLog,
};
