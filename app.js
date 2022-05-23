require('dotenv').config();
const morganBody = require('morgan-body');
const express = require('express');
const session = require('express-session');
// const redis = require('redis');
const cookieParser = require('cookie-parser');

// Error handle
const { UserFacingError, DatabaseError, ApplicationError } = require('./server/util/error/base_error');

//const Redis = require('ioredis');

const cors = require('cors');
const app = express();
const Cache = require('./server/util/cache');
const { PORT_TEST, PORT, NODE_ENV, API_VERSION } = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;

const root = require('path').join(__dirname, 'interview-training/build');

app.use(express.static(root));

app.use(cookieParser());
app.disable('X-Powered-By');

app.set('trust proxy', 1);
app.use(
  cors({
    credentials: true,
    origin: [`${process.env.REACT_APP_BASE_URL}`, 'http://localhost:3001'],
    methods: 'GET, POST, PUT, DELETE',
  })
);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('json spaces', 2);

const RedisStore = require('connect-redis')(session);

//Configure session middleware
app.use(
  session({
    store: new RedisStore({ client: Cache }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(8600000), // if true prevent client side JS from reading the cookie
    },
  })
);

// morganBody(app);

// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/user_route'),
  require('./server/routes/coding_route'),
  require('./server/routes/record_route'),
  require('./server/routes/social_route'),
  require('./server/routes/course_route'),
  require('./server/routes/training_route'),
]);

const http = require('http');
const server = http.createServer(app);
require('./server/util/mysocket').config(server);

// Page not found
app.use(function (req, res, next) {
  res.sendStatus(404);
  next();
});

// Error handling
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  if (err instanceof UserFacingError || err instanceof DatabaseError || err instanceof ApplicationError) {
    res.sendStatus(err.statusCode).send(err.response);
  }
  res.status(500).send('Internal Server Error');
});

if (NODE_ENV != 'production') {
  server.listen(port, async () => {
    console.log(`Listening on port: ${port}`);
  });
}

module.exports = app;
