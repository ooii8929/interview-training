require('dotenv').config();
const Redis = require('ioredis');
const { CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD } = process.env;

const redisClient = new Redis({
  port: CACHE_PORT, // Redis port
  host: CACHE_HOST, // Redis host
  username: CACHE_USER, // needs Redis >= 6
  password: CACHE_PASSWORD,
  db: 0, // Defaults to 0
});

redisClient.ready = false;

redisClient.on('error', () => {
  redisClient.ready = false;
  console.log('Error in Redis');
});

redisClient.on('ready', () => {
  redisClient.ready = true;
  console.log('Redis is ready');
});

redisClient.on('end', () => {
  redisClient.ready = false;
  console.log('Redis is disconnected');
});

module.exports = redisClient;
