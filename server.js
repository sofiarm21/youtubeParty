const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

const playVideo  = (socket, arg) => {
    socket.broadcast.emit('video:play', arg)
}

const stopVideo = (socket, arg) => {
    socket.broadcast.emit('video:stop', arg)
}

const seekVideo = (socket, arg) => {
    socket.broadcast.emit('video:seek', arg)
}

const changeVideo = (socket, arg) => {
    console.log('video:change ' + arg);
    socket.broadcast.emit('video:change', arg)
}

io.on('connection', (socket) => {
    onConnection(socket)
})

const onConnection = (socket) => {
    socket.on('video:play', (arg) => playVideo(socket, arg))
    socket.on('video:stop', (arg) => stopVideo(socket, arg))
    socket.on('video:seek', (arg) => seekVideo(socket, arg))
    socket.on('video:change', (arg) => changeVideo(socket, arg))
}

httpServer.listen(3001, () => {
    console.log('Server running on port 3001');
})
