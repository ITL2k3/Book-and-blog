import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication, checkPermission} from '../../Auth/checkAuth.js'
import BookController from '../../controller/book.controller.js'
import permission from '../../configs/config.permission.js'
import upload from '../../utils/uploadfile.js'

const bookRouter = Router()



// check auth
bookRouter.use('/', asyncHandler(authentication))
bookRouter.get('/get-all-books', asyncHandler(BookController.getAllBooks))





//check permission
bookRouter.use(checkPermission(permission["LIBRARIAN"]))
bookRouter.post('/post-book',upload.single('pdf'),asyncHandler(BookController.insertBook))


export default bookRouter