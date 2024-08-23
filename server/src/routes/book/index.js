import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication, checkPermission} from '../../Auth/checkAuth.js'
import BookController from '../../controller/book.controller.js'
import permission from '../../configs/config.permission.js'
import upload from '../../utils/uploadfile.js'

const bookRouter = Router()



// check auth
bookRouter.use('/', asyncHandler(authentication))
//passed
bookRouter.get('/', async (req, res) => {
    res.send({
        statusCode: 200,
        statusText: 'authen success'
    })
})
bookRouter.get('/get-all-books', asyncHandler(BookController.getAllBooks))





//check permission
bookRouter.use(checkPermission(permission["LIBRARIAN"]))
bookRouter.post('/post-book',upload.fields([{
    name: 'pdf', maxCount: 1}, 
    {
    name: 'img', maxCount: 1
}]),asyncHandler(BookController.insertBook))


export default bookRouter