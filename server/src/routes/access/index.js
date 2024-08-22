import { Router } from 'express'
import AccessController from '../../controller/access.controller.js'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication } from '../../Auth/checkAuth.js'

const accessRouter = Router()


accessRouter.post('/register', asyncHandler(AccessController.register))
accessRouter.post('/login', asyncHandler(AccessController.login))


// check auth
accessRouter.use('/', asyncHandler(authentication))

accessRouter.post('/logout', asyncHandler(AccessController.logout))
// accessRouter.get('/getuser', asyncHandler(AccessController.getUser))
export default accessRouter