import { BadRequestError, InternalServerError } from "../common/error.response.js"
import { OK, SuccessResponse } from "../common/success.response.js"
import AccountService from "../services/account.service.js"
import ChatService from "../services/chat.service.js"

class AccountController {
    getAccountById = async(req, res, next) => {
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
        const accountWithConversationId = {...account, conversationId }

        new SuccessResponse({
            message: "Get account by id successfully",
            metadata: accountWithConversationId
        }).send(res)
    }

    getAllAccount = async(req, res, next) => {
        const accounts = await AccountService.getAllAccount()
        new SuccessResponse({
            message: "Get all account successfully",
            metadata: accounts
        }).send(res)
    }

    deleteAccount = async(req, res, next) => {
        const { id } = req.query
        const account = await AccountService.deleteAccount(id)
        new SuccessResponse({
            message: "Delete account successfully",
            metadata: account
        }).send(res)
    }

    updateRole = async(req, res, next) => {
        const { id } = req.query
        const { role } = req.query
        //role is valid
        if (role == 'A' || role == 'B' || role == 'C') {
            const account = await AccountService.updateRole(id, role)
            new SuccessResponse({
                message: "Update role successfully",
                metadata: account
            }).send(res)
        }else {
            throw new BadRequestError('Role is not valid')

        }

    }
}

export default new AccountController