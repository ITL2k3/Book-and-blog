import BookRepo from "../repository/BookRepo.js"

const BookHelper = new BookRepo()
class BookService {

    static getAllBooks = async () => {
        const result = BookHelper.getAllBooks()
        return result
    } 

    static insertBook = async (payload) => {
    
        console.log(payload);
        //insert book and get bookId 
        const bookId = await BookHelper.insertIntoBookTableValues(payload)
        
        //take key of not null value
        const categories = Object.entries(payload.categories).filter(([key, value]) => value != 'null')
        .map(([key]) => key)

        categories.forEach(async (category) => {
            await BookHelper.insertIntoBookCategoryTableValues({categoryId: category, bookId: bookId.Id})
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