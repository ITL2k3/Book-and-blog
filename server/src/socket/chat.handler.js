import ChatService from '../services/chat.service.js';

const onlineUsers = new Map();

const chatHandler = (io, socket) => {

    //user login, set sid to onlineUsers
    socket.on("userOnline", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(onlineUsers);
    });
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

            //send message if user online
            if (onlineUsers.has(receiverId)) {
                io.to(onlineUsers.get(receiverId)).emit("receiveMessage", newMessage);
                //update status to delivered
                await ChatService.updateMessageStatus(newMessage.insertId, 'delivered');
            }

            // Emit message back to sender
            // socket.emit("receiveMessage", newMessage);

        } catch (error) {
            console.error('Error in sendMessage:', error);
            socket.emit("chat_error", { message: "Failed to send message" });
        }
    });

    socket.on("disconnect", () => {
        for (let [userId, socketId] of onlineUsers) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log('after dis  ', onlineUsers);
    })

};

export default chatHandler;