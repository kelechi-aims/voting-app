import chai from 'chai';
import { Server, createServer } from 'http';
import { io as Client, Socket } from 'socket.io-client';
import { Server as SocketIOServer } from 'socket.io';
import { AddressInfo } from 'net';
import app from '../src/app';
import { describe } from 'node:test';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const { expect } = chai;

describe('Server Setup and Socket.IO Tests', () => {
    let server: Server;
    let io: SocketIOServer;
    let clientSocket: Socket;

    before((done) => {
        server = createServer(app);
        io = new SocketIOServer(server);
        app.set('io', io);

        server.listen(() => {
            const { port } = server.address() as AddressInfo;
            clientSocket = Client(`http://localhost:${port}`);
            clientSocket.on('connect', done);
        });
    });

    after(() => {
        io.close();
        clientSocket.close();
        server.close();
    });

    it('should respond to HTTP request', (done) => {
        chai.request(app)
        .get('/');
        .end((err, res) => {
            expect(res).to.have.status(404); 
            done();
        });
    });

    it('should connect a client via Socket.IO', (done) => {
        clientSocket.once('connect', () => {
            expect(clientSocket.connected).to.be.true;
            done();
        });
    });

    it('should allow a client to join a poll room', (done) => {
        const testPollId = '1ef6c218-e16a-4cd3-8548-ce0bddbce190';
        clientSocket.emit('joinPollRoom', testPollId);

        clientSocket.on('joinedPollRoom', (roomId: string) => {
            expect(roomId).to.equal(testPollId);
            done();
        });

        io.emit('joinPollRoom', testPollId); // Mocking the server-side event
    });

    it('should allow a client to leave a poll room', (done) => {
        const testPollId = '1ef6c218-e16a-4cd3-8548-ce0bddbce190';
        clientSocket.emit('leavePollRoom', testPollId);

        clientSocket.on('leftPollRoom', (roomId: string) => {
            expect(roomId).to.equal(testPollId);
            done();
        });

        io.emit('leavePollRoom', testPollId); // Mocking the server-side event
    });
});