import { io } from 'socket.io-client';

// Connect to the server 
const socket = io('http://localhost:5000');

// Listen for a connection
socket.on('connect', () => {
    console.log(`Connected to the server with ID: ${socket.id}`);

    // Send a test message to server
    socket.emit('testMessage', 'Hello from the client!');

    // Listen for a response from the server
    socket.on('testResponse', (message) => {
        console.log(`Server says: ${message}`);
    });
});

// Handle disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});