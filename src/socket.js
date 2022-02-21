const { io } = require('socket.io-client');

const URL = 'http://localhost:3001/';
const socket = io(URL);
console.log('socket');
console.log(socket);


socket.on('connect', () => {
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

// socket.io.on('error', (error) => {
//     console.log('and error happened');
//     console.log(error);
// });


socket.onAny((event, ...args) => {
    console.log('socket any');
    console.log(event, args);
    console.log(socket.connected);
});


export default socket;
