import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication, checkPermission} from '../../Auth/checkAuth.js'
import BookController from '../../controller/book.controller.js'
import permission from '../../configs/config.permission.js'
import upload from '../../utils/uploadfile.js'

const bookRouter = Router()




bookRouter.get('/Library/search', asyncHandler(BookController.getBooks))
bookRouter.get('/book-detail/:id', asyncHandler(BookController.getDetailBook))
bookRouter.get('/search-doc', asyncHandler(BookController.searchBooks))
bookRouter.get('/search-doc-advance', asyncHandler(BookController.searchBooksAdvance))



bookRouter.get('/text-doc/:id', asyncHandler(BookController.readTextDoc))

//tài liệu tham khảo
bookRouter.get('/references-doc', asyncHandler(BookController.referenceDoc))

//tài liệu đề xuất
bookRouter.get('/suggest-docs', asyncHandler(BookController.suggestDoc))


// check auth

bookRouter.use('/', asyncHandler(authentication))
//passed
bookRouter.get('/', async (req, res) => {
    try{
        res.send({
            statusCode: 200,
            statusText: 'authen success',
            userId: req.user.userId
        })
    }catch(err){
        res.send({
            statusCode: 500,
            statusText: 'internal server err, Not sign in!'
        })
    }
   
})





bookRouter.get('/read-book/:path', asyncHandler(BookController.getPdfBook))
bookRouter.get('/read-book/sourceId/:path', asyncHandler(BookController.getSourceId))
bookRouter.get('/load-anotation', asyncHandler(BookController.loadAnotation))
bookRouter.post('/save-anotation', asyncHandler(BookController.saveAnotation))


//manage doc for user

bookRouter.get('/user/get-book', asyncHandler(BookController.getUserBook))
bookRouter.get('/user/search-book-upload', asyncHandler(BookController.searchBooksUpload))
bookRouter.post('/user/post-book',upload.fields([{
    name: 'pdf', maxCount: 1}, 
    {
    name: 'img', maxCount: 1
}]),asyncHandler(BookController.insertBook))

bookRouter.put('/user/update-book',upload.fields([{
    name: 'pdf', maxCount: 1}, 
    {
    name: 'img', maxCount: 1
}]),asyncHandler(BookController.updateBook))

bookRouter.delete('/user/delete-book', asyncHandler(BookController.deleteBook))



//check permission
bookRouter.use('/lib', checkPermission(permission["LIBRARIAN"]))

//search 


bookRouter.get('/lib', async (req, res) => {
    res.send({
        statusCode: 200,
        statusText: 'authen success'
    })
})
//

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