import ChatService from '../services/chat.service.js';

const onlineUsers = new Map();

const chatHandler = (io, socket) => {

    //user login, set sid to onlineUsers và join room
    socket.on("userOnline", (userId) => {
        // Tạo room name cho user
        const userRoom = `user_${userId}`;

        // Join vào room của user
        socket.join(userRoom)
        onlineUsers.set(userId, {
            socketId: socket.id,
            room: userRoom
        });

        // Broadcast trạng thái online
        io.emit("userOnline", userId);

    });

    socket.on("checkOnline", (userId) => {
            if (onlineUsers.has(userId)) {
                socket.emit("userOnline", userId);
            } else {
                socket.emit("userOffline", userId);
            }
        })
        //server recerive message from user
    socket.on("sendMessage", async({ senderId, receiverId, message }) => {
        try {

            //find conservation between 2 user
            let [conversation] = await ChatService.findConversation(senderId, receiverId);
            let conversationId;

            //conservation don't exists, create new conversation
            if (!conversation) {
                const newConversation = await ChatService.createConversation(senderId, receiverId);
                if (!newConversation || !newConversation.insertId) {
                    throw new Error('Failed to create conversation');
                }
                conversationId = newConversation.insertId;
            } else {
                conversationId = conversation.id;
            }

            if (!conversationId) {
                throw new Error('Invalid conversation ID');
            }

            console.log('Conversation ID:', conversationId);

            //insert message in mysql
            const newMessage = await ChatService.createMessage(conversationId, senderId, receiverId, message);

            // Gửi tin nhắn đến room của receiver nếu online
            if (onlineUsers.has(receiverId)) {
                const receiverData = onlineUsers.get(receiverId);
                //send message to ALL CLIENT, since socket.io not support to send message to specific room
                socket.broadcast.emit("receiveMessage", newMessage);


                await ChatService.updateMessageStatus(newMessage.insertId, 'delivered');
            }

            // Gửi lại tin nhắn cho sender
            socket.emit("receiveMessage", newMessage);
            console.log('Message sent back to sender');

        } catch (error) {
            console.error('Error in sendMessage:', error);
            socket.emit("chat_error", { message: "Failed to send message" });
        }
    });



    socket.on("markAsRead", async({ conversationId, userId }) => {
        try {
            await ChatService.updateMessageStatus(conversationId, userId, 'read');
        } catch (error) {
            console.log("mark as read: ", error);
            socket.emit("chat_error", { message: "Failed to mark as read" });
        }
    })

    socket.on("disconnect", () => {
        for (let [userId, userData] of onlineUsers) {
            if (userData.socketId === socket.id) {
                // Rời khỏi room khi disconnect
                socket.leave(userData.room);
                onlineUsers.delete(userId);
                io.emit("userOffline", userId);
                break;
            }
        }
        console.log('User disconnected, remaining users:', onlineUsers);
    })

};

export default chatHandler;