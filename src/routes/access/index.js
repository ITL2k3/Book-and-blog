import { Router } from 'express'
import AccessController from '../../controller/access.controller.js'


const accessRouter = Router()


accessRouter.post('/register', AccessController.register)
accessRouter.get('/getuser', AccessController.getUser)
export default accessRouter