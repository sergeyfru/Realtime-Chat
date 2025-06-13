import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// const socket = io('http://localhost:3000');
const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  withCredentials:true
});

socket.on('connect', () => {
  console.log('Successfully connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err);
});
function ChatApp() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.on('chat_message', (msg) => {
      setChatMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {

      socket.emit('chat_message', message);
      console.log(socket);
      
      setMessage('');
    }
  };

  return (
    <div className="chat-app">
      <h2>Chat Room</h2>
      <div className="chat-messages">
        {chatMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatApp;
