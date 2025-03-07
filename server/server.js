import app from "./src/app.js";
import { initSocket } from "./src/socket/socket.js";

const PORT = process.env.PORT || 3056

const server = app.listen(PORT, () => {
    console.log('Book_blog start on port, ', PORT)
})

// Initialize socket.io
const io = initSocket(server);

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit server')
    })
})