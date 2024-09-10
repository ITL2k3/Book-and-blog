import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication, checkPermission} from '../../Auth/checkAuth.js'
import BookController from '../../controller/book.controller.js'
import permission from '../../configs/config.permission.js'
import upload from '../../utils/uploadfile.js'

const bookRouter = Router()



// check auth
bookRouter.get('/Library/search', asyncHandler(BookController.getBooks))
bookRouter.get('/book-detail/:id', asyncHandler(BookController.getDetailBook))



bookRouter.use('/', asyncHandler(authentication))
//passed
bookRouter.get('/', async (req, res) => {
    res.send({
        statusCode: 200,
        statusText: 'authen success'
    })
})





bookRouter.get('/read-book/:path', asyncHandler(BookController.getPdfBook))
bookRouter.get('/load-anotation', asyncHandler(BookController.loadAnotation))
bookRouter.post('/save-anotation', asyncHandler(BookController.saveAnotation))



//check permission
bookRouter.use('/lib', checkPermission(permission["LIBRARIAN"]))


bookRouter.get('/lib', async (req, res) => {
    res.send({
        statusCode: 200,
        statusText: 'authen success'
    })
})
bookRouter.post('/lib/post-book',upload.fields([{
    name: 'pdf', maxCount: 1}, 
    {
    name: 'img', maxCount: 1
}]),asyncHandler(BookController.insertBook))

bookRouter.put('/lib/update-book',upload.fields([{
    name: 'pdf', maxCount: 1}, 
    {
    name: 'img', maxCount: 1
}]),asyncHandler(BookController.updateBook))

bookRouter.delete('/lib/delete-book', asyncHandler(BookController.deleteBook))


export default bookRouter