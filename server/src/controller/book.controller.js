import { BadRequestError } from "../common/error.response.js"
import { CREATED, OK, SuccessResponse } from "../common/success.response.js"
import BookDTO from "../dtos/BookDTO.js"
import BookService from "../services/book.service.js"
import path from 'path'

const __dirname = import.meta.dirname;

class BookController {

    getBooks = async (req, res, next) => {
        const page = req.query.page
        const results = await BookService.getBooks(page)
        let sumOfBooks
        if(page == '1'){
            const {SUM} = await BookService.countBooks()
            sumOfBooks = SUM
        }
        new OK({
            message: 'get success',
            metadata: {
                results: results,
                sumOfBooks: sumOfBooks
            }
        }).send(res)
       
    }

    getDetailBook = async (req, res, next) => {
        const {id} = req.params
        const isValidIdParam = /^[0-9]+$/.test(id)
        if(!isValidIdParam){
            throw new BadRequestError('id truyền vào không đúng định dạng')
        }
    
        const result = await BookService.getOneBook(id)
        if(result.length == 0){
            throw new BadRequestError('Sách không tồn tại!')
        }
        new OK({
            message: 'get one book success',
            metadata: result
        }).send(res)
    }


    insertBook = async (req, res, next) => {
        console.log(req.body);
        const newBook = new BookDTO(req.body)
        const isValidBook = newBook.validateBook()
        if(isValidBook && isValidBook["error"]){
            throw new BadRequestError(
                isValidBook["error"].message
            )
        }
        
        new CREATED({
            message: 'insert Book success',
            metadata: await BookService.insertBook({
                ...isValidBook.value,
                categories: {
                    kns: req.body.kns,
                    kt: req.body.kt,
                    tc: req.body.tc,
                    cn: req.body.cn,
                    nn: req.body.nn,
                    dc: req.body.dc,
                    gt: req.body.gt
                },
                thumbnail: req.body.thumbnail,
                description: req.body.description,
                filepath: req.filePdfPath,
                
            })

        }).send(res)

    }


}

export default new BookController