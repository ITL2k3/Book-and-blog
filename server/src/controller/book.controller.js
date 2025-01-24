import { BadRequestError } from "../common/error.response.js"
import { CREATED, OK, SuccessResponse } from "../common/success.response.js"
import BookDTO from "../dtos/BookDTO.js"
import BookService from "../services/book.service.js"
import path, { basename } from 'path'
import fs from 'fs'


class BookController {
    getSourceId = async(req, res, next) => {
         
        const { path } = req.params
        const parts = path.split('_');

        // path có dạng filename_bookid
        const filename = parts[0]
        const bookId = parts[1]

        new OK({
            messsage: "get source success",
            metadata: await BookService.getSourceIdPDF(bookId)
        }).send(res)

    }
    searchBooks = async(req, res, next) => {
        const { query } = req.query

        new OK({
            message: "search success",
            metadata: await BookService.searchBooks(query)
        }).send(res)
    }
    getUserBook = async(req, res, next) => {
        
        const page = req.query.page
        
        const results = await BookService.getUserBooks(page, req.user.userId)

        let sumOfBooks

        const { SUM } = await BookService.countBooksWithUserId(req.user.userId)
        sumOfBooks = SUM

      
        new OK({
            message: 'get success',
            metadata: {
                results: results,
                sumOfBooks: sumOfBooks,

            }
        }).send(res)

    }

    getBooks = async(req, res, next) => {

        const page = req.query.page
        const { category } = req.query
        if (!req.query.option) throw new BadRequestError('Not Found')
        const results = await BookService.getBooks(page, req.query.option, category)

        let sumOfBooks

        const { SUM } = await BookService.countBooks(category)
        sumOfBooks = SUM

        console.log(sumOfBooks);
        new OK({
            message: 'get success',
            metadata: {
                results: results,
                sumOfBooks: sumOfBooks,

            }
        }).send(res)

    }


    getDetailBook = async(req, res, next) => {
        const { id } = req.params
        const isValidIdParam = /^[0-9]+$/.test(id)
        if (!isValidIdParam) {
            throw new BadRequestError('id truyền vào không đúng định dạng')
        }

        const result = await BookService.getOneBook(id)
        if (result.length == 0) {
            throw new BadRequestError('Sách không tồn tại!')
        }
        new OK({
            message: 'get one book success',
            metadata: result
        }).send(res)
    }


    getPdfBook = async(req, res, next) => {
        
        const { path } = req.params
        const parts = path.split('_');

        // path có dạng filename_bookid
        const filename = parts[0]
        const bookId = parts[1]

        await BookService.upViewsBook(bookId)
        const stream = fs.createReadStream(`uploads/files_pdf/${filename}.pdf`)
        stream.on('error', (err) => {
            console.log('Error reading file: ', err);
            res.status(500).send('Internal Server Error')
        })
        res.on('error', (err) => {
            console.error('Error writing response:', err);
        });
        stream.pipe(res)

    }

    loadAnotation = async(req, res, next) => {
        const { userId } = req.user
        const { bookId } = req.query
        new OK({
            message: 'load success',
            metadata: await BookService.loadAnotation({ userId, bookId })
        }).send(res)

    }
    saveAnotation = async(req, res, next) => {
        const { userId } = req.user
        const { xml, bookId } = req.body

        BookService.saveAnotation({ userId, xml, bookId })

        new OK({
                message: 'save success',
            }).send(res)
            // const {xml, userId, bookId} = req.body



    }

    







    insertBook = async(req, res, next) => {
        console.log(req.body);
        const newBook = new BookDTO(req.body)
        const isValidBook = newBook.validateBook()
        if (isValidBook && isValidBook["error"]) {
            throw new BadRequestError(
                isValidBook["error"].message
            )
        }
        new CREATED({
            message: 'insert Book success',
            metadata: await BookService.insertBook({
                ...isValidBook.value,
                userId: req.user.userId,
                categories: {
                    kns: req.body.kns,
                    kt: req.body.kt,
                    tc: req.body.tc,
                    cn: req.body.cn,
                    nn: req.body.nn,
                    dc: req.body.dc,
                    gt: req.body.gt
                },
                source_id_chatPDF: req.body.source_id_chatPDF,
                isPublic: req.body.isPublic,
                thumbnail: req.body.thumbnail,
                description: req.body.description,
                filepath: req.filePdfPath,

            })

        }).send(res)
        console.log('hello');
    }

    updateBook = async(req, res, next) => {

        //set null for '' string
        Object.entries(req.body).forEach(([key, value]) => {
                if (value == '') {
                    req.body[key] = null
                }
            })
            //check categories 
        const categories = {
            kns: req.body.kns,
            kt: req.body.kt,
            tc: req.body.tc,
            cn: req.body.cn,
            nn: req.body.nn,
            dc: req.body.dc,
            gt: req.body.gt
        }
        if (!BookDTO.validateCategories(categories)) {
            throw new BadRequestError('sách phải có ít nhất 1 thể loại')
        }
        // console.log('bookcontroller.updatebook: ',req.body);
        new OK({
            message: 'update Book success',
            metadata: await BookService.updateBook({
                categories: categories,
                ...req.body,
                filepath: req.filePdfPath,

            })

        }).send(res)
    }

    deleteBook = async(req, res, next) => {

        new OK({
            message: 'Delete success',
            metadata: await BookService.deleteBook(req.query)
        }).send(res)
    }


}

export default new BookController