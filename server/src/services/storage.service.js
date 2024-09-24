import { BadRequestError } from "../common/error.response.js"
import StorageRepo from "../repository/StorageRepo.js"

const storageHelper = new StorageRepo()

class StorageService {

    static getBooksFromStorage = async({userId, page}) => {
       
        const LIMIT = 15;
        const OFFSET = (page - 1) * LIMIT
        const books = await storageHelper.getBooksFromStorage({userId, LIMIT, OFFSET})
        const bookIds = books.map((book) => {
            return book.book_id
        })
        if(books.length != 0){
            
            const categories = await storageHelper.getCategoriesFromBooks(bookIds)
        
            const results = books.map(book => {
            const bookCategories = categories.filter(category => category.book_id === book.book_id).map(category => category.name_category)
            return {
                ...book,
                categories: bookCategories // Thêm thuộc tính categories
              };
            })
            console.log(results);
            return results
        }
        
        return 1
        
       
    }

    static insertBookInStorage = async(payload) => {
        //check book exists in storage
        const isExistsBook = await storageHelper.checkBookExistsInStorage(payload)
        if(isExistsBook){
            throw new BadRequestError("Book already Exists")
        }

        //Add book 
        await storageHelper.insertBookInStorage(payload)
        return 1
    }

    static deleteBookFromStorage = async(payload) => {
        await storageHelper.deleteBookFromStorage(payload)
        return 1
    }
}

export default StorageService