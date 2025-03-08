import ChatRepo from "../repository/ChatRepo.js"
import { getIO } from "../socket/socket.js"
import AccountService from "./account.service.js"

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
        const [messageReturn] = await chatRepo.getMessageById(result.insertId)
        return messageReturn
    }

    static updateMessageStatus = async ({conversationId, status}) => {
        const message = await chatRepo.UpdateMessageStatus({status, conversationId})
   
        return message
    }

    static getAllConservationOfOneUser = async (userId) => {
        //get all id of conversation of user
        const conversation = await chatRepo.getAllConservationOfOneUser(userId)
        //filter all conversation to get receiver_id
        const receiverIds = conversation.map(item => {
            return item.user1_id === userId ? {receiverId: item.user2_id, conversationId: item.id} : {receiverId: item.user1_id, conversationId: item.id}
        })
        //get all user info of receiver_id

        const receivers = receiverIds.map(async (receiver) => {
            return {
                ...await AccountService.getAccountById(receiver.receiverId),
                conversationId: receiver.conversationId
            } 
        })
        //await promise
        const res = await Promise.all(receivers)
       


        return res
    }

    static getMessageByConversationId = async (conversationId) => {
        const message = await chatRepo.getMessageByConversationId(conversationId)
        return message
    }



}

export default ChatService;