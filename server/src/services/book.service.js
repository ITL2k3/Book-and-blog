import BookRepo from "../repository/BookRepo.js"

const BookHelper = new BookRepo()
class BookService {

    static getAllBooks = async () => {
        const result = BookHelper.getAllBooks()
        return result
    } 

    static insertBook = async (payload) => {

        await BookHelper.insertIntoTableValues(payload)

        //not throw error <=> add success

        return {
            payload
        }
    


    }


}

export default BookService