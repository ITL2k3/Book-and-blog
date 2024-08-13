import table from "../configs/config.table.js";
import connection from "../dbs/init.mysql.js";
import BaseRepo from "./BaseRepo.js";
import BookEntity from "./entities/Book.entity.js";
import UserEntity from "./entities/user.entity.js";



class BookRepo extends BaseRepo {
    insertIntoTableValues = async (payload) => {
        //convert DTO -> Domain Model
        let newBook = new BookEntity(payload)

        const newBookQueryString = newBook.getQueryString()
            
        const [results, fields] = await connection.query(
            `INSERT INTO ${table.BOOK} VALUES ${newBookQueryString}`
        )
        
        

        return results
    }
    getAllBooks = async () => {
        const [results, fields] = await connection.query(
            `SELECT * FROM ${table.BOOK}`
        )
        return results
    }
    getUserById = async(userId) => {
        const [results, fields] = await connection.query(
            `SELECT * FROM ${table.USER}
             WHERE user_id = ${userId}
            `
        )
        return results

    }

}

export default BookRepo