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
    console.log('playVideo');
    console.log(arg);
    socket.broadcast.emit('video:play', arg)

}

const stopVideo = (socket, arg) => {
    console.log('stopVideo');
    console.log(arg);
    console.log(socket.id);
    socket.broadcast.emit('video:stop', arg)
}

io.on('connection', (socket) => {
    console.log(socket.id);
    onConnection(socket)
})

const onConnection = (socket) => {
    console.log('socket');
    console.log(socket.id);
    socket.on('video:play', (arg) => playVideo(socket, arg))
    socket.on('video:stop', (arg) => stopVideo(socket, arg))
}

httpServer.listen(3001, () => {
    console.log('Server running on port 3001');
})
