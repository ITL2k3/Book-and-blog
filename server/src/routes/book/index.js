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


bookRouter.get('/Library/search', asyncHandler(BookController.getBooks))
bookRouter.get('/book-detail/:id', asyncHandler(BookController.getDetailBook))


bookRouter.get('/read-book/:path', asyncHandler(BookController.getPdfBook))
bookRouter.get('/load-anotation')
bookRouter.post('/save-anotation')



//check permission
bookRouter.use(checkPermission(permission["LIBRARIAN"]))



bookRouter.post('/post-book',upload.fields([{
    name: 'pdf', maxCount: 1}, 
    {
    name: 'img', maxCount: 1
}]),asyncHandler(BookController.insertBook))

bookRouter.put('/update-book',upload.fields([{
    name: 'pdf', maxCount: 1}, 
    {
    name: 'img', maxCount: 1
}]),asyncHandler(BookController.updateBook))

bookRouter.delete('/delete-book', asyncHandler(BookController.deleteBook))


export default bookRouter