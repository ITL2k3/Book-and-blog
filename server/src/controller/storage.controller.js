import { BadRequestError } from "../common/error.response.js"
import { CREATED, OK } from "../common/success.response.js"
import StorageService from "../services/storage.service.js"

class StorageController {

    getBooksFromStorage = async(req, res, next) => {
        const { userId } = req.user
        const {page} = req.query
      
        
        new OK({
            message: "Get All Book success",
            metadata: await StorageService.getBooksFromStorage({ userId, page })
        }).send(res)
    }

    insertBookInStorage = async(req, res, next) => {
        const { userId } = req.user
        const { bookId } = req.body
        if (!bookId || !userId) throw new BadRequestError("bookID or userId not found")
        new CREATED({
            message: "Add book success",
            metadata: await StorageService.insertBookInStorage({ userId, bookId })
        }).send(res)
    }

    deleteBookFromStorage = async(req, res, next) => {
        const { userId } = req.user
        const { book_id } = req.query
        if (!book_id || !userId) throw new BadRequestError("bookID or userId not found")
        new CREATED({
            message: "Add book success",
            metadata: await StorageService.deleteBookFromStorage({ userId, bookId: book_id })
        }).send(res)
    }
}

export default new StorageController