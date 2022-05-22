require('dotenv').config();

const { Server } = require('socket.io');
let io;

function config(server) {
  // Socket.io Initialization
  console.log('Initialize socket');
  io = new Server(server, {
    cors: {
      origin: '*',
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
}

module.exports = {
  config,
};
