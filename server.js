const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const fs = require('fs')



const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 3001;

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: isProduction ? 'https://youtube-house-party.herokuapp.com' : 'http://localhost:3000'
    }
})

app.use(express.static(__dirname + '/build'))
app.use(bodyParser.json())

app.get('*', function (req, res, next) {
    // Prevents an HTML response for API calls
    if (req.path.indexOf('/api/') != -1) {
        return next();
    }
    fs.readFile(__dirname + '/build/index.html', 'utf8', function (err, text) {
        res.send(text);
    })
})



const playVideo  = (socket, arg) => {
    const { room } = arg
    console.log('video:play ' + room);
    socket.broadcast.to(room).emit('video:play', room)
}

const stopVideo = (socket, arg) => {
    const { room } = arg
    socket.broadcast.to(room).emit('video:stop', arg)
}

const seekVideo = (socket, arg) => {
    const { room, sc } = arg
    socket.broadcast.to(room).emit('video:seek', sc)
}

const changeVideo = (socket, arg) => {
    console.log('video:change ' + arg);
    const { room, sc } = arg
    socket.broadcast.to(room).emit('video:change', sc)
}

const joinRoom = (socket, arg) => {
    console.log('room:join ' + arg);
    socket.join(arg)
}

io.on('connection', (socket) => {
    onConnection(socket)
})

const onConnection = (socket) => {
    socket.on('video:play', (arg) => playVideo(socket, arg))
    socket.on('video:stop', (arg) => stopVideo(socket, arg))
    socket.on('video:seek', (arg) => seekVideo(socket, arg))
    socket.on('video:change', (arg) => changeVideo(socket, arg))
    socket.on('room:join', (arg) => joinRoom(socket, arg))
}

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
