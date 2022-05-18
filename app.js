require('dotenv').config();
const morganBody = require('morgan-body');
const express = require('express');
const session = require('express-session');
// const redis = require('redis');
const connectRedis = require('connect-redis');
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

// CORS allow all

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
//app.use(cors());

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

const fs = require('fs');

// app.use(express.static('interview-training/build'));
// var RedisStore = require('connect-redis')(session);

//Configure session middleware
app.use(
    session({
        store: new RedisStore({ client: Cache }),
        secret: 'secret$%^134',
        resave: false,
        saveUninitialized: false,
        cookie: {
            //httpOnly: true,
            // secure: true,
            // sameSite: 'none',
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
// 有人連線就會觸發
io.on('connection', (socket) => {
    // 加入房間
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
//io.of('/stream').on('connection', stream);

dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        process.exit();
    }
});

// async function findNowRoom(client) {
//     let nowUser;
//     for await (let key of client.adapter.sids.keys()) {
//         if (key !== client.id) {
//             nowUser = key;

//             return nowUser;
//         }
//     }

//     return nowUser;
// }

// io.on('connection', async (client) => {
//     console.log(`socket 用戶連接 ${client.id}`);

//     client.on('joinRoom', async (room) => {
//         const nowRoom = await findNowRoom(client);
//         if (nowRoom) {
//             client.leave(nowRoom);
//         }
//         client.join(room);
//         client.in(nowRoom).emit('roomBroadcast', '已有新人加入聊天室！');
//     });

//     client.on('peerconnectSignaling', async (message) => {
//         //console.log("接收資料：", message);

//         const nowRoom = await findNowRoom(client);

//         client.to(nowRoom).emit('peerconnectSignaling', message);
//     });

//     client.on('disconnect', () => {
//         console.log(`socket 用戶離開 ${client.id}`);
//     });
// });

// SWAGGER generate API doc
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./public/src/swagger.json');

// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/favicon.ico', (req, res) => {
    return;
});

// API routes
app.use('/api/' + API_VERSION, [
    require('./server/routes/user_route'),
    require('./server/routes/coding_route'),
    require('./server/routes/social_route'),
    require('./server/routes/course_route'),
]);

// Page not found
app.use(function (req, res, next) {
    res.sendStatus(404);
});

// Error handling
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send('Internal Server Error');
});
