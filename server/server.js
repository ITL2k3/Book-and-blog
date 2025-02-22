import app from "./src/app.js";
import { Server } from "socket.io";
const PORT = process.env.PORT || 3056

const server = app.listen(PORT, () => {
    console.log('Book_blog start on port, ',PORT)
})

//gắn socket io vào server
const io = new Server(server, {
    cors:{
        origin: [`http://localhost:5173`, `http://localhost:3006`],
        methods: ['GET', 'POST'],
        credentials: true
    }
})
//lắng nghe kết nối từ client

io.on('connection', (socket) => {
   
    console.log('🔗 User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit server')
    })
})


export default io