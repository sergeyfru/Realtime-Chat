const socket = io();
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const userList = document.getElementById('user-list');

const username = prompt('Enter your username:');
const room = prompt('Enter room name:');

socket.emit('joinRoom', { username, room });

// Display new message
socket.on('message', (message) => {
  const div = document.createElement('div');
  div.textContent = message;
  chatBox.appendChild(div);
});

// Display active users
socket.on('roomUsers', (users) => {
  userList.innerHTML = '';
  users.forEach((user) => {
    const div = document.createElement('div');
    div.textContent = user.username;
    userList.appendChild(div);
  }); 
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('chatMessage', message);
    messageInput.value = '';
  }
});