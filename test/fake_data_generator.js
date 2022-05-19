#! /usr/bin/env node

require('dotenv').config({ path: `${__dirname}/.env` });
const got = require('got');
const { pool } = require(`${__dirname}/server/models/mysqlcon`);
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const argon2 = require('argon2');
const { users, roles, products, product_images, colors, variants, hots, hot_products, campaigns } = require('./fake_data');

const insertFakeData = async () => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    const hash = await argon2.hash('123123');
    let tutor = {
      email: 'tutor@gmail.com',
      password: hash,
      name: 'test tutor',
      provider: 'native',
      picture: 'https://interview-appworks.s3.ap-northeast-1.amazonaws.com/avator/591eb62067956.jpeg',
    };

    // test no random
    const [questions] = await conn.query('INSERT INTO tutors SET ? ', [tutor]);

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
