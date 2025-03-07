import ChatRepo from "../repository/ChatRepo.js"
import { getIO } from "../socket/socket.js"

const chatRepo = new ChatRepo()

class ChatService {
    static findConversation = async (senderId, receiverId) => {
        const conversation = await chatRepo.findConversation(senderId, receiverId)
        return conversation
    }

    static createConversation = async (senderId, receiverId) => {
        const conversation = await chatRepo.createConversation(senderId, receiverId)
        return conversation
    }

    static createMessage = async (conservationId, senderId, receiverId, message) => {
        const result = await chatRepo.createMessage(conservationId, senderId, receiverId, message)
        return result
    }

    static updateMessageStatus = async (messageId, status) => {
        const message = await chatRepo.UpdateMessageStatus(messageId, status)
        return message
    }

    static getAllConservationOfOneUser = async (userId) => {
        const conversation = await chatRepo.getAllConservationOfOneUser(userId)
        return conversation
    }
}

export default ChatService;