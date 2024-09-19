import { Router } from 'express'
import AccessController from '../../controller/access.controller.js'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication } from '../../Auth/checkAuth.js'

const accessRouter = Router()


accessRouter.use('/register', asyncHandler(AccessController.register))
accessRouter.use('/login', asyncHandler(AccessController.login))


// check auth

accessRouter.use('/get-info', asyncHandler(authentication), asyncHandler(AccessController.getAccount))
accessRouter.use('/logout', asyncHandler(authentication), asyncHandler(AccessController.logout))
// accessRouter.get('/getuser', asyncHandler(AccessController.getUser))
export default accessRouter