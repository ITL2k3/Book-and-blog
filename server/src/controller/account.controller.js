import { BadRequestError, InternalServerError } from "../common/error.response.js"
import { OK, SuccessResponse } from "../common/success.response.js"
import AccountService from "../services/account.service.js"
import ChatService from "../services/chat.service.js"

class AccountController {
    getAccountById = async (req, res, next) => {
        const { id } = req.query
       
        const account = await AccountService.getAccountById(id)
        //check conversation exsits, return id with account
        let [conversation] = await ChatService.findConversation(req.user.userId, id);
        let conversationId;

        //conservation don't exists, create new conversation
        if (!conversation) {
            const newConversation = await ChatService.createConversation(req.user.userId, id);
            if (!newConversation || !newConversation.insertId) {
                throw new InternalServerError('Failed to create conversation');
            }
            conversationId = newConversation.insertId;
        } else {
            conversationId = conversation.id;
        }
        const accountWithConversationId = { ...account, conversationId}

        new SuccessResponse({
            message: "Get account by id successfully",
            metadata: accountWithConversationId
        }).send(res)
    }

}

export default new AccountController