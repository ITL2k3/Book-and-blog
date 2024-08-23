import { InternalServerError } from "../common/error.response.js";
import table from "../configs/config.table.js";
import connection from "../dbs/init.mysql.js";
import BaseRepo from "./BaseRepo.js";
import BookEntity from "./entities/Book.entity.js";
import Book_CategoryEntity from "./entities/Book_cateogries.entity.js";
import UserEntity from "./entities/user.entity.js";



class BookRepo extends BaseRepo {
    insertIntoBookTableValues = async(payload) => {
        //convert DTO -> Domain Model
        let newBook = new BookEntity(payload)

        const newBookQueryString = newBook.getQueryString()
        console.log('helloasds', newBookQueryString);

        const [results, fields] = await connection.query(
            `INSERT INTO ${table.BOOK} VALUES ${newBookQueryString};
            SELECT LAST_INSERT_ID() as Id;
            `
        )
        const [bookId] = results[1]
        return bookId
    }

    insertIntoBookCategoryTableValues = async(payload) => {
        let newBookCategory = new Book_CategoryEntity(payload)
        let queryString = newBookCategory.getQueryString()

        const [results, fields] = await connection.query(
            `INSERT INTO ${table.BOOK_CATEGORY} VALUES ${queryString};
            `
        )
        return results

    }





    getAllBooks = async() => {
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