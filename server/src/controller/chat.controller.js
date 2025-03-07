import ChatService from '../services/chat.service.js'
class ChatController {
    getAllConversationOfUser = async (req, res, next) => {
        const userId = req.user.userId
        const conversation = await ChatService.getAllConservationOfOneUser(userId)
        new SuccessResponse({
            message: 'Get conversation of user success',
            metadata: conversation
        }).send(res)
    }
}

export default new ChatController
