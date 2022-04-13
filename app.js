require('dotenv').config();
const morganBody = require('morgan-body');
const express = require('express');
const cors = require('cors');
const app = express();
const { PORT_TEST, PORT, NODE_ENV, API_VERSION } = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;

const fs = require('fs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
morganBody(app);

app.get('/favicon.ico', (req, res) => {
    return;
});

const server = require('http')
    .Server(app)
    .listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });
// Socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});

async function findNowRoom(client) {
    let nowUser;
    for await (let key of client.adapter.sids.keys()) {
        if (key !== client.id) {
            nowUser = key;

            return nowUser;
        }
    }

    return nowUser;
}

io.on('connection', async (client) => {
    console.log(`socket 用戶連接 ${client.id}`);

    client.on('joinRoom', async (room) => {
        const nowRoom = await findNowRoom(client);
        if (nowRoom) {
            client.leave(nowRoom);
        }
        client.join(room);
        client.in(nowRoom).emit('roomBroadcast', '已有新人加入聊天室！');
    });

    client.on('peerconnectSignaling', async (message) => {
        //console.log("接收資料：", message);

        const nowRoom = await findNowRoom(client);

        client.to(nowRoom).emit('peerconnectSignaling', message);
    });

    client.on('disconnect', () => {
        console.log(`socket 用戶離開 ${client.id}`);
    });
});

// SWAGGER generate API doc
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./public/src/swagger.json');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CORS allow all
app.use(cors());

// API routes
app.use('/api/' + API_VERSION, [require('./server/routes/user_route'), require('./server/routes/coding_route')]);
// Page not found
app.use(function (req, res, next) {
    res.sendStatus(404);
});

// Error handling
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send('Internal Server Error');
});
