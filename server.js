const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')

const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 3001;

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: 'https://youtube-house-party.herokuapp.com'
    }
})

const playVideo  = (socket, arg) => {
    console.log('arg');
    console.log(arg);
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
