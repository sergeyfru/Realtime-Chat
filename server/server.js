const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, '../client')));

let users = {}; // To track connected users and their rooms

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    socket.emit('message', 'Welcome to the chat!');

    // Notify others in the room
    socket.broadcast.to(room).emit('message', `${username} has joined the chat.`);

    // Update active users list
    const activeUsers = Object.values(users).filter((user) => user.room === room);
    io.to(room).emit('roomUsers', activeUsers);
  });
 
  socket.on('chatMessage', (msg) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message', `${user.username}: ${msg}`);
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const { room, username } = user;
      socket.broadcast.to(room).emit('message', `${username} has left the chat.`);
      delete users[socket.id];

      const activeUsers = Object.values(users).filter((user) => user.room === room);
      io.to(room).emit('roomUsers', activeUsers);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
