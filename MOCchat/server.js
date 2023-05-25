const express = require('express');
const app = express();

const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Running on server ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// socket
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log("connected!!")
  let name;

  socket.on('join', (username) => {
    name = username;
    const joinMsg = { user: name, message: ' has joined the chat.' };
    socket.broadcast.emit('joined', joinMsg);
  });

  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log("dissconnected user!!")
    const leaveMsg = { user: name, message: ' has left the chat.' };
    socket.broadcast.emit('leave', leaveMsg);
  });    
});

