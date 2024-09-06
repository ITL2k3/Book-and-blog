import { InternalServerError } from "../common/error.response.js";
import table from "../configs/config.table.js";
import connection from "../dbs/init.mysql.js";
import BaseRepo from "./BaseRepo.js";



class StorageRepo extends BaseRepo {

    getBooksFromStorage = async({userId, LIMIT, OFFSET}) => {
        
        const [result, fields] = await connection.query(`
            SELECT book_id, title, author, thumbnail, description FROM
            ${table.STORAGE} join ${table.BOOK} using (book_id)
            WHERE user_id = ${userId}
            LIMIT ${LIMIT}
            OFFSET ${OFFSET}
            ; 
            `)
        return result
    }

    checkBookExistsInStorage = async({userId, bookId}) => {
        const [result, fields] = await connection.query(`
            SELECT COUNT(*) FROM ${table.STORAGE}
            WHERE user_id = ${userId} AND book_id = ${bookId}
            `)
        return result[0]["COUNT(*)"]

    }
    
    insertBookInStorage = async ({userId, bookId}) => {
        const [result, fields] = await connection.query(`
            INSERT INTO ${table.STORAGE} VALUES
            (${userId}, ${bookId})
            `)
        return 1
    
    }

    deleteBookFromStorage = async ({userId, bookId}) => {
        const [result, fields] = await connection.query(`
            DELETE FROM ${table.STORAGE} 
            WHERE user_id = ${userId} AND book_id = ${bookId}
        `)

        return 1
    }

}

export default StorageRepo