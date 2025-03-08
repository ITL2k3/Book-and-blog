import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication, checkPermission} from '../../Auth/checkAuth.js'
import ChatController from '../../controller/chat.controller.js'
import permission from '../../configs/config.permission.js'


const chatRouter = Router()

chatRouter.use('/', asyncHandler(authentication))

chatRouter.get('/get-all-conservation', asyncHandler(ChatController.getAllConversationOfUser))

chatRouter.get('/get-message-by-conversation-id', asyncHandler(ChatController.getMessageByConversationId))




// check auth






export default chatRouter