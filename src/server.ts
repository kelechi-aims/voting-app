import app from './app';
import { createServer } from 'http';
import  { Server as SocketIOServer } from 'socket.io';

const port = process.env.PORT || 5000;

const server = createServer(app);

const io = new SocketIOServer(server, {
    cors: {
        origin: '*', // Allow requests from any client (adjust to frontend for security)
        credentials: true,
        methods: ["GET", "POST"], // Allow only GET and POST requests
    },
});

// Set up a simple connection listener
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Listen to 'joinPoll' event to allow clients to join a room for real-time updates
    socket.on('joinPoll', (pollId) => {
        socket.join(pollId);
        console.log(`Client ${socket.id} joined poll ${pollId}`);
    });

    // Listen to 'leavePoll' event to allow clients to join a room for real-time updates
    socket.on('leavePoll', (pollId) => {
        socket.leave(pollId);
        console.log(`Client ${socket.id} left poll ${pollId}`);
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Attach the Socket.IO instance to the server
app.set('io', io);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});