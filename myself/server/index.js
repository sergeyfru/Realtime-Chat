import express from "express";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

// // open the database file
// const db = await open({
//   filename: "chat.db",
//   driver: sqlite3.Database,
// });

// // create our 'messages' table (you can ignore the 'client_offset' column for now)
// await db.exec(`
//   CREATE TABLE IF NOT EXISTS messages (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       client_offset TEXT UNIQUE,
//       content TEXT
//   );
// `);

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    //   credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 1000000,
    skipMiddlewares: true,
  },
});

const _dirname = dirname(fileURLToPath(import.meta.url));
const rooms = {};

app.get("/", (req, res) => {
  res.sendFile(join(_dirname, "index.html"));
  // res.send('Server is running')
});

io.on("connection", async (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("createRoom", ({ userName }) => {
    const roomCode = Math.random().toString(16).substring(2, 8);
    socket.join(roomCode);
    rooms[roomCode] = [{ id: socket.id, name: userName }]
    
    socket.emit("roomCreated", roomCode);
    io.to(roomCode).emit('updateUsers', rooms[roomCode])

    console.log('Room has been created with code: ',roomCode);
    console.log(rooms);
    
  });

  socket.on("joinRoom", ({ roomCode, userName }) => {
    console.log("in join room");

    if (io.sockets.adapter.rooms.has(roomCode)) {
      console.log(`room "${roomCode}" exists`);
      socket.join(roomCode);
      rooms[roomCode].push({ id: socket.id, name: userName })
      socket.emit("roomJoined", "You have joined the room");
      io.to(roomCode).emit('updateUsers', rooms[roomCode])
      console.log(`User ${socket.id} (${userName}) joined the room`);
      
    } else {
      socket.emit("roomError", "This room does not exist");
    }
    console.log(rooms);
    
  });

  socket.on("disconnect", () => {
    for(let roomCode in rooms){
        const index = rooms[roomCode].findIndex(user=> user.id === socket.id)
        if(index !== -1){
            rooms[roomCode].splice(index,1)
            io.to(roomCode).emit('updateUsers',rooms[roomCode])
            break
        }
    }
    console.log(`User disconnected`);
  });
});

// io.on("connection", async (socket) => {

//   console.log("a user connected  with Sockret.id - ", socket.id);

//   socket.on('join',({roomName, userName,roomCode})=>{

//     console.log(socket.rooms);

//     console.log(`User: ${userName} connected in room: "${roomName}"`);

//   })
//   socket.on('create-something',(msg)=>{
//     console.log(`message from create-something: ${msg}`);
//     io.emit('create-something', msg, )
//   })

//   socket.on("chat message", async (msg, clientOffset,callback) => {
//     console.log(`Message: ${msg}`);
//     let result;
//     try {
//       result = await db.run("INSERT INTO messages (content) VALUES (?, ?)", msg, clientOffset);
//     } catch (error) {
//         if(e.errno === 19 ){
//             callback()
//         }else{
//         // nothing to do, just let the client retry
//         }
//       return;

//     }
//     io.emit("chat message", msg, result.lastID);
//     // io.emit('chat message', msg)

//     callback()
//   });

//   if (!socket.recovered) {
//     try {
//       await db.each(
//         "SELECT id, content FROM messages WHERE id > ?",
//         [socket.handshake.auth.serverOffset || 0],
//         (_err, row) => {
//           socket.emit("chat message", row.content, row.id);
//         }
//       );
//     } catch (error) {
//       console.log("Error");
//     }
//   }

//   socket.on("disconnect", () => {
//     console.log(`User disconnected`);
//   });
// });

server.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
