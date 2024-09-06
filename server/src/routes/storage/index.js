import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication} from '../../Auth/checkAuth.js'
import StorageController from '../../controller/storage.controller.js'
const storageRouter = Router()



// check auth
storageRouter.use('/', asyncHandler(authentication))
//passed
storageRouter.get('/', async (req, res) => {
    res.send({
        statusCode: 200,
        statusText: 'authen success'
    })
})


storageRouter.get('/get-books-from-storage', asyncHandler(StorageController.getBooksFromStorage))

storageRouter.post('/add-book-to-storage', asyncHandler(StorageController.insertBookInStorage))

storageRouter.delete('/delete-book-from-storage', asyncHandler(StorageController.deleteBookFromStorage))


export default storageRouter