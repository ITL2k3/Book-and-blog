import { Router } from 'express'
import AccessController from '../../controller/access.controller.js'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { checkToken } from '../../Auth/checkAuth.js'

const accessRouter = Router()


accessRouter.post('/register', asyncHandler(AccessController.register))

// check auth
accessRouter.use('/', asyncHandler(checkToken))

accessRouter.get('/getuser', AccessController.getUser)
export default accessRouter