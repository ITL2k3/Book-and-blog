import { BadRequestError } from "../common/error.response.js"
import StorageRepo from "../repository/StorageRepo.js"

const storageHelper = new StorageRepo()

class StorageService {

    static getBooksFromStorage = async({userId, page}) => {
        const LIMIT = 5;
        const OFFSET = (page - 1) * LIMIT
        const result = await storageHelper.getBooksFromStorage({userId, LIMIT, OFFSET})
        return result
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