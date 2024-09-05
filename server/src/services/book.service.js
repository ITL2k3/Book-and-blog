import { BadRequestError } from "../common/error.response.js"
import table from "../configs/config.table.js"
import BookRepo from "../repository/BookRepo.js"
import { getFilepathFromString } from "../utils/index.js"
const bookHelper = new BookRepo()
class BookService {

    static countBooks = async() => {
        const [results] = await bookHelper.countAllEntities(table.BOOK)
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
        const results = await bookHelper.getBooks(fields, LIMIT, OFFSET)

        return results
    }

   

    static getOneBook = async(id) => {
        const result = await bookHelper.getOneBookById('*',id)

        return result
    }

    







    static insertBook = async(payload) => {

        //insert book and get bookId 
        const bookId = await bookHelper.insertIntoBookTableValues(payload)

        //take key of not null value
        const categories = Object.entries(payload.categories).filter(([key, value]) => value != 'null')
            .map(([key]) => key)

        categories.forEach(async(category) => {
            await bookHelper.insertIntoBookCategoryTableValues({ categoryId: category, bookId: bookId.Id })
        })
        console.log(categories);
        //not throw error <=> add success

        return {
            payload
        }

    }

    static loadAnotation = async(payload) => {
        const result = await bookHelper.loadAnotation(payload)
        return result
    }
    static saveAnotation = async (payload) => {
        bookHelper.saveAnotation(payload)
        return 1
    }







    static updateBook = async(payload) => {
        //if update filepath required:  
        if(payload.filepath){
            //delete old file
            const [linkOldFilePath] = await bookHelper.getOneBookById('filepath',payload.bookId)
            fs.unlink(`uploads/files_pdf/${getFilepathFromString(linkOldFilePath.filepath)}`)
            .catch((err) => {
            console.log('file Not Found');
            })
        }

        //update book record

        await bookHelper.updateIntoBookTableValues(payload)
        //update categories record
        await bookHelper.deleteBookCategory(payload.bookId)
        const categories = Object.entries(payload.categories).filter(([key, value]) => value != 'null')
            .map(([key]) => key)

        categories.forEach(async(category) => {
            await bookHelper.insertIntoBookCategoryTableValues({ categoryId: category, bookId: payload.bookId })
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
        await bookHelper.deleteBookCategory(book_id)
        await bookHelper.deleteBook(book_id)
        //delete file
        return book_id
    }


}

export default BookService