import { BadRequestError } from "../common/error.response.js"
import { CREATED, SuccessResponse } from "../common/success.response.js"
import BookDTO from "../dtos/BookDTO.js"
import BookService from "../services/book.service.js"

class BookController {

    getAllBooks = async (req, res, next) => {
        new SuccessResponse({
            message: 'get All success',
            metadata: await BookService.getAllBooks()
        }).send(res)
    }

    insertBook = async (req, res, next) => {
        const newBook = new BookDTO(req.body)
        const isValidBook = newBook.validateBook()
        if(isValidBook && isValidBook["error"]){
            throw new BadRequestError(
                isValidBook["error"].message
            )
        }


        

        new CREATED({
            message: 'insert Book success',
            metadata: await BookService.insertBook(isValidBook.value)

        }).send(res)

    }


}

export default new BookController