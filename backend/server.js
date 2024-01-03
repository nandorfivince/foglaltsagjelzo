const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Állítsd be a CORS beállításokat a Socket.IO szerveren
const io = socketIo(server, {
    cors: {
      origin: "*", // Engedélyezd minden forrást. Szűkítsd le a termelési környezetben.
      methods: ["GET", "POST"], // Engedélyezd a GET és POST kéréseket
      transports: ['websocket', 'polling'] // Engedélyezd a websocket és polling transzportokat
    }
});

let buttonState = 'Szabad'; // A gomb kezdeti állapota

io.on('connection', (socket) => {
    // Küldd el az aktuális állapotot az újonnan csatlakozott klienseknek
    socket.emit('stateChange', buttonState);

    // Amikor a kliens állapotot változtat
    socket.on('changeState', (newState) => {
        buttonState = newState;
        io.emit('stateChange', buttonState); // Frissítsd minden kliensnél az állapotot
    });
});

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Szerver fut a következő porton: ${port}`);
});
