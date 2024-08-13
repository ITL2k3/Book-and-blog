import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { checkToken } from '../../Auth/checkAuth.js'
import BookController from '../../controller/book.controller.js'

const bookRouter = Router()



// check auth
bookRouter.use('/', asyncHandler(checkToken))

bookRouter.post('/post-book', asyncHandler(BookController.insertBook))


bookRouter.get('/get-all-books', asyncHandler(BookController.getAllBooks))


export default bookRouter