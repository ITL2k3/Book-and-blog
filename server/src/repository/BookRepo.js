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
    loadAnotation = async({bookId, userId}) => {
        const [result, fields] = await connection.query(
            `SELECT xml_data FROM ${table.ANOTATION}
            WHERE book_id = ${bookId} AND user_id = ${userId}
            `
        )
        let [xml] = result
        return xml
    }

    saveAnotation = async ({bookId, userId, xml}) =>{

        const [result, fields] = await connection.query(
            `SELECT COUNT(*) FROM ${table.ANOTATION}
            WHERE book_id = ${bookId} AND user_id = ${userId}
            `
        )
        const isExistsAnotation = result[0]["COUNT(*)"]
        
        if(isExistsAnotation){ //record exists
            const query = `
                UPDATE ${table.ANOTATION}
                SET xml_data = (?)
                WHERE book_id = (?) AND user_id = (?)`
            await connection.execute(query, [xml, bookId, userId], (err, results, fields) => {
                if (err) {
                    console.error('Lỗi khi thực hiện truy vấn:', err);
                } else {
                    console.log('Insert thành công:', results);
                }
            })
        }else{
            const query = `INSERT INTO ${table.ANOTATION} (book_id, user_id, xml_data)
               VALUES (?, ?, ?)`;

            await connection.execute(query, [bookId, userId, xml], (err, results, fields) => {
                if (err) {
                    console.error('Lỗi khi thực hiện truy vấn:', err);
                  } else {
                    console.log('Insert thành công:', results);
                  }
            })


            // await connection.query(`
            //     INSERT INTO ${table.ANOTATION}
            //     VALUES (${bookId}, ${userId}, '${xml}')
            // `)
        }
        console.log(result);
    }

}

export default BookRepo