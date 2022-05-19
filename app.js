require('dotenv').config();
const morganBody = require('morgan-body');
const express = require('express');
const session = require('express-session');
// const redis = require('redis');
const cookieParser = require('cookie-parser');

//const Redis = require('ioredis');

const cors = require('cors');
const app = express();
const Cache = require('./server/util/cache');
const { PORT_TEST, PORT, NODE_ENV, API_VERSION } = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;

const { CACHE_HOST, CACHE_PORT, CACHE_USER, CACHE_PASSWORD } = process.env;

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

const dbo = require('./server/models/mongodbcon');

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

const server = require('http')
  .Server(app)
  .listen(port, () => {
    // Cache.connect().catch(() => {
    //     console.log('redis connect fail');
    // });
    console.log(`Listening on port ${port}...`);
  });

// morganBody(app);

// Socket.io
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

// Someone Connect
io.on('connection', (socket) => {
  socket.on('join', (room) => {
    console.log(socket.id);
    socket.join(room);
    console.log('準備通話');
    socket.to(room).emit('ready', '準備通話');
  });
  socket.on('getMessage', (message) => {
    console.log(message);
  });

  // 轉傳 Offer
  socket.on('offer', (room, desc) => {
    console.log('收到 offer', room);
    socket.to(room).emit('offer', desc);
  });

  // 轉傳 Answer
  socket.on('answer', (room, desc) => {
    console.log('收到 answer');
    socket.to(room).emit('answer', desc);
  });

  // 交換 ice candidate
  socket.on('ice_candidate', (room, data) => {
    console.log('收到 ice_candidate');
    socket.to(room).emit('ice_candidate', data);
  });

  socket.on('share', (room, data) => {
    console.log('收到分享螢幕');
    socket.to(room).emit('share', data);
  });

  // 離開房間
  socket.on('leaved', (room) => {
    console.log('leave room', room);
    socket.to(room).emit('bye');
    socket.emit('leaved');
  });

  socket.on('chat', (data) => {
    console.log(data.sender, 'send a message:', data.msg, 'time', data.time);
    socket.to(data.room).emit('chat', { sender: data.sender, msg: data.msg, time: data.time });
  });
});

dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }
});

// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/user_route'),
  require('./server/routes/coding_route'),
  require('./server/routes/record_route'),
  require('./server/routes/social_route'),
  require('./server/routes/course_route'),
  require('./server/routes/training_route'),
]);

// Page not found
app.use(function (req, res, next) {
  res.sendStatus(404);
  next();
});

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});
