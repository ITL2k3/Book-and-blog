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

    updateIntoBookTableValues = async(payload) => {
        let newBook = new BookEntity(payload)

        const UpdateQueryString = newBook.getUpdateQueryString()
        if(!UpdateQueryString){
            return 0
        }
        const [results, fields] = await connection.query(
            `UPDATE ${table.BOOK} SET
            ${UpdateQueryString}
            WHERE book_id = ${payload.bookId}
            `
        )
        return 1
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

    deleteBook = async (bookId) => {
        const [results, fields] = await connection.query(
            `DELETE FROM ${table.BOOK}
            WHERE book_id = ${bookId};
            `
        )
        return results 
    }
    deleteBookCategory = async (bookId) => {
        const [results, fields] = await connection.query(
            `DELETE FROM ${table.BOOK_CATEGORY}
            WHERE book_id = ${bookId};
            `
        )
        return results 
    }





    getBooks = async(field, LIMIT, OFFSET) => {
        const [results, fields] = await connection.query(
            `SELECT ${field} FROM ${table.BOOK}
             LIMIT ${LIMIT}
             OFFSET ${OFFSET} 
            `
        )
        return results
    }

    getOneBookById = async(field ,bookId) => {
        const [results, fields] = await connection.query(
            `SELECT ${field}
            FROM ${table.BOOK}
            WHERE book_id = ${bookId}
            `
        )
        return results
    }

    getUserById = async(field, userId) => {
        const [results, fields] = await connection.query(
            `SELECT ${field} FROM ${table.USER}
             WHERE user_id = ${userId}
            `
        )
        return results

    }

}

export default BookRepo