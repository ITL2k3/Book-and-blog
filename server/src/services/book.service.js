import { BadRequestError } from "../common/error.response.js"
import table from "../configs/config.table.js"
import BookRepo from "../repository/BookRepo.js"
import fs from 'fs/promises'
import { getFilepathFromString } from "../utils/index.js"
const BookHelper = new BookRepo()
class BookService {

    static countBooks = async() => {
        const [results] = await BookHelper.countAllEntities(table.BOOK)
        return results
    }

    static getBooks = async(page, option) => {
        const LIMIT = 5;
        const OFFSET = (page - 1) * LIMIT
        let fields = ''
        if(option == 'Home'){
            fields = 'book_id, title, author, thumbnail'
        }else if(option == 'update-book'){
            fields = '*'
        }
        const results = await BookHelper.getBooks(fields, LIMIT, OFFSET)

        return results
    }

   

    static getOneBook = async(id) => {
        const result = await BookHelper.getOneBookById('*',id)

        return result
    }
    static insertBook = async(payload) => {

        //insert book and get bookId 
        const bookId = await BookHelper.insertIntoBookTableValues(payload)

        //take key of not null value
        const categories = Object.entries(payload.categories).filter(([key, value]) => value != 'null')
            .map(([key]) => key)

        categories.forEach(async(category) => {
            await BookHelper.insertIntoBookCategoryTableValues({ categoryId: category, bookId: bookId.Id })
        })
        console.log(categories);
        //not throw error <=> add success

        return {
            payload
        }

    }


    static updateBook = async(payload) => {
        //if update filepath required:  
        if(payload.filepath){
            //delete old file
            const [linkOldFilePath] = await BookHelper.getOneBookById('filepath',payload.bookId)
            fs.unlink(`uploads/files_pdf/${getFilepathFromString(linkOldFilePath.filepath)}`)
            .catch((err) => {
            console.log('file Not Found');
            })
        }

        //update book record

        await BookHelper.updateIntoBookTableValues(payload)
        //update categories record
        await BookHelper.deleteBookCategory(payload.bookId)
        const categories = Object.entries(payload.categories).filter(([key, value]) => value != 'null')
            .map(([key]) => key)

        categories.forEach(async(category) => {
            await BookHelper.insertIntoBookCategoryTableValues({ categoryId: category, bookId: payload.bookId })
        })
        //not throw error <=> add success

        return {
            payload
        }

    }









    static deleteBook = async(payload) => {
        const {book_id, file} = payload
        fs.unlink(`uploads/files_pdf/${getFilepathFromString(file)}`)
        .catch((err) => {
            console.log('file Not Found');
        })
        //delete record
        await BookHelper.deleteBookCategory(book_id)
        await BookHelper.deleteBook(book_id)
        //delete file
        return book_id
    }


}

export default BookService