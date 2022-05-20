#! /usr/bin/env node

require('dotenv').config({ path: `../.env` });
const { pool } = require(`../server/models/mysqlcon`);
const { NODE_ENV } = process.env;
const argon2 = require('argon2');
const { users, professions, tutors, tutors_professions, tutors_time, appointments, questions, questions_video } = require('./fake_data');

async function _createFakeUser(conn) {
  const encryped_users = await Promise.all(
    users.map(async (user) => {
      const encryped_user = {
        email: user.email,
        password: await argon2.hash(user.password),
        name: user.name,
        provider: user.provider,
        picture: user.picture,
        last_login_dt: new Date(),
      };
      return encryped_user;
    })
  );
  return await conn.query('INSERT INTO users (email, password, name, provider, picture,last_login_dt) VALUES ?', [encryped_users.map((x) => Object.values(x))]);
}

async function _createFakeProfession(conn) {
  return await conn.query('INSERT INTO professions (profession) VALUES ?', [professions.map((x) => Object.values(x))]);
}

async function _createFakeTutors(conn) {
  const encryped_tutors = await Promise.all(
    tutors.map(async (tutor) => {
      const encryped_user = {
        email: tutor.email,
        password: await argon2.hash(tutor.password),
        name: tutor.name,
        provider: tutor.provider,
        picture: tutor.picture,
        last_login_dt: new Date(),
        experience1: tutor.experience1,
        experience2: tutor.experience2,
        experience3: tutor.experience3,
        introduce: tutor.introduce,
        profession: tutor.profession,
      };
      return encryped_user;
    })
  );
  return await conn.query('INSERT INTO tutors (email, password, name, provider, picture,last_login_dt,experience1,experience2,experience3,introduce,profession) VALUES ?', [
    encryped_tutors.map((x) => Object.values(x)),
  ]);
}

async function _createFakeTutorsProfessions(conn) {
  return await conn.query('INSERT INTO tutors_professions (tutor_id,profession_id) VALUES ?', [tutors_professions.map((x) => Object.values(x))]);
}

async function _createFakeTutorsTime(conn) {
  return await conn.query('INSERT INTO tutors_time (t_id,available_time,course_url,status) VALUES ?', [tutors_time.map((x) => Object.values(x))]);
}

async function _createFakeAppointments(conn) {
  return await conn.query('INSERT INTO appointments (user_id,tutor_time_id,status) VALUES ?', [appointments.map((x) => Object.values(x))]);
}

async function _createFakeQuestions(conn) {
  return await conn.query(
    'INSERT INTO questions (title,description,javascript,python,python_answer_command,run_code_question,profession,call_user_answer,test_answer,formal_answer,category) VALUES ?',
    [questions.map((x) => Object.values(x))]
  );
}

async function _createFakeQuestionsVideo(conn) {
  return await conn.query('INSERT INTO questions_video (title,description,hint_1,hint_2,hint_3,profession) VALUES ?', [questions_video.map((x) => Object.values(x))]);
}

async function createFakeData() {
  if (NODE_ENV !== 'test') {
    console.log('Not in test env');
    return;
  }
  const conn = await pool.getConnection();
  await conn.query('START TRANSACTION');
  await conn.query('SET FOREIGN_KEY_CHECKS = ?', 0);
  await _createFakeUser(conn);
  await _createFakeProfession(conn);
  await _createFakeTutors(conn);
  await _createFakeTutorsProfessions(conn);
  await _createFakeTutorsTime(conn);
  await _createFakeAppointments(conn);
  await _createFakeQuestions(conn);
  await _createFakeQuestionsVideo(conn);
  await conn.query('SET FOREIGN_KEY_CHECKS = ?', 1);
  await conn.query('COMMIT');
  await conn.release();
}
async function truncateFakeData() {
  if (NODE_ENV !== 'test') {
    console.log('Not in test env');
    return;
  }

  const truncateTable = async (table) => {
    const conn = await pool.getConnection();
    await conn.query('START TRANSACTION');
    await conn.query('SET FOREIGN_KEY_CHECKS = ?', 0);
    await conn.query(`TRUNCATE TABLE ${table}`);
    await conn.query('SET FOREIGN_KEY_CHECKS = ?', 1);
    await conn.query('COMMIT');
    await conn.release();
    return;
  };

  const tables = ['users', 'professions', 'tutors', 'tutors_professions', 'tutors_time', 'appointments', 'questions', 'questions_video'];
  for (let table of tables) {
    await truncateTable(table);
  }

  return;
}

async function closeConnection() {
  return await pool.end();
}

async function main() {
  await truncateFakeData();
  await createFakeData();
  await closeConnection();
}

// execute when called directly.
if (require.main === module) {
  main();
}
