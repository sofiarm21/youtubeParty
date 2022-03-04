const { io } = require('socket.io-client');
const { API_ROOT } = require('./constants')

const URL = API_ROOT;
const socket = io(URL);
console.log('socket');
console.log(socket);


socket.on('connect', (args) => {
    console.log('Successfully connected!');
    console.log(socket.id);
})

socket.on('disconnect', () => {
    console.log(socket.connected);
})

socket.on('connect_error', (error) => {
    console.log('Failed to connect to server');
    console.log(error);
});


socket.onAny((event, ...args) => {
    console.log('socket any');
    console.log(event, args);
    console.log(socket.connected);
});


export default socket;
