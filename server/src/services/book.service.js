import table from "../configs/config.table.js"
import BookRepo from "../repository/BookRepo.js"

const BookHelper = new BookRepo()
class BookService {

    static countBooks = async() => {
        const [results] = await BookHelper.countAllEntities(table.BOOK)
        return results
    }

    static getBooks = async(page) => {
        const LIMIT = 5;
        const OFFSET = (page - 1) * LIMIT
        const results = await BookHelper.getBooks(LIMIT, OFFSET)
        return results
    }

    static getOneBook = async(id) => {
        const result = await BookHelper.getOneBookById(id)

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
        // await BookHelper.insertIntoBookCategoryTableValues({...payload, bookId: bookId})
        // //not throw error <=> add success

        return {
            payload
        }



    }


}

export default BookService