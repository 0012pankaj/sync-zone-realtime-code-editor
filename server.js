import express from 'express';
const app = express(); // Returns an object
import http from 'http'; // Present in Node.js
import { Server } from 'socket.io';
import ACTIONS from './Actions.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server=http.createServer(app); //chreated http server req for socket
const io=new Server(server);// web server to handle WebSocket connectio


app.use(express.static('dist'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});



//when server run first we serve static files as dist that contain index.html our aap at production time
const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}


//event listner when conection build
io.on('connection',(socket)=>{
   console.log('socket connected at',socket.id);
   socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;

    // console.log( userSocketMap)

    socket.join(roomId); //check if room present and add or create new room then add;
     const clients = getAllConnectedClients(roomId);
    //  console.log(clients);
    //notify to all clint who joined with name 
    clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, { 
            clients,
            username,
            socketId: socket.id,
        });
    });

   });

   socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => { //recive event code_change send by editor
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });//brodcasting to all present in roomexcept me, then sent code to that room ,send event on_change to editor
    });
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

   socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
            socketId: socket.id,
            username: userSocketMap[socket.id],
        });
    });
    delete userSocketMap[socket.id];
    // console.log( userSocketMap)
    socket.leave();
});

});



// const PORT = process.env.PORT || 5000;
const PORT = 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
