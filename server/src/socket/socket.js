import { Server } from "socket.io";
import chatHandler from './chat.handler.js';
import { InternalServerError } from "../common/error.response.js";

let io;
let isInitialized = false;

export const initSocket = (server) => {
    if (isInitialized) {
        return io;
    }

    io = new Server(server, {
        cors: {
            origin: [`http://localhost:5173`, `http://localhost:3006`],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Register socket event handlers
    io.on('connection', (socket) => {
        console.log('🔗 User connected:', socket.id);

        // Register chat handlers
        chatHandler(io, socket);

        socket.on('disconnect', () => {
            console.log('❌ User disconnected:', socket.id);
        });
    });

    isInitialized = true;
    return io;
};

// Export singleton instance with retry mechanism
export const getIO = (maxRetries = 5, retryInterval = 1000) => {
    return new Promise((resolve, reject) => {
        let retries = 0;

        const tryGetIO = () => {
            //if io is initialized => return resolve with io
            if (io && isInitialized) {
                resolve(io);
                return;
            }

            //if retries >= maxRetries => return reject with error
            if (retries >= maxRetries) {
                reject(new InternalServerError('Socket.io initialization timeout'));
                return;
            }

            retries++;
            console.log(`Waiting for Socket.io to initialize... (attempt ${retries}/${maxRetries})`);
            //make a recursive call to tryGetIO each 1s
            setTimeout(tryGetIO, retryInterval);
        };

        tryGetIO();
    });
};

export default { initSocket, getIO };