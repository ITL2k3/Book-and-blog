import { InternalServerError } from "../common/error.response.js";
import table from "../configs/config.table.js";
import connection from "../dbs/init.mysql.js";
import BaseRepo from "./BaseRepo.js";
import BookEntity from "./entities/Book.entity.js";
import Book_CategoryEntity from "./entities/Book_cateogries.entity.js";
import UserEntity from "./entities/user.entity.js";



class BookRepo extends BaseRepo {

    insertReport = async (authorId, userId, message, bookId) => {
        const [result, fields] = await connection.query(`
            INSERT INTO report VALUE
            (default, ?, ?, ?, ?,default, default)
            `, [message, userId, bookId, authorId])
        return result
    }

    getReferencesDoc = async(categories, limit, numOfCategories) => {
        //query that find record base on exactly their category id 
        const [result, fields] = await connection.query(`
            SELECT b.*
            FROM book b
            JOIN book_category bc ON b.book_id = bc.book_id
            WHERE bc.category_id IN (?)  -- Thay thế bằng các category_id cụ thể
            AND b.isPublic = true        -- Chỉ lấy sách có trường isPublic = true
            GROUP BY b.book_id
            HAVING COUNT(DISTINCT bc.category_id) = ?  -- Đảm bảo sách thuộc cả 3 danh mục
            ORDER BY b.num_of_views DESC
            LIMIT ?;
        `, [categories, numOfCategories ,limit])
        
        return result
    }

    getSourceId = async(bookId) => {
        const [results, fields] = await connection.query(
            `SELECT source_id_chatPDF FROM ${table.BOOK}
            WHERE book_id = ${bookId}
        `
        )

        return results

    }

    countAllEntities = async() => {
        const [results, fields] = await connection.query(
            `SELECT COUNT(*) as SUM
            FROM book 
            WHERE isPublic = true
            `
        )

        return results
    }
    upNumViewBook = async(bookId) => {


        const [results, fields] = await connection.query(
            `UPDATE ${table.BOOK} SET
            num_of_views = num_of_views + 1
            WHERE book_id = ${bookId}
            `
        )


        return 1


    }

    insertIntoBookTableValues = async(payload) => {
        //convert DTO -> Domain Model
        let newBook = new BookEntity(payload)

        const newBookQueryString = newBook.getQueryString()

        try {
            const [results, fields] = await connection.query(
                `INSERT INTO ${table.BOOK} VALUES ${newBookQueryString};
                SELECT LAST_INSERT_ID() as Id;
                
                `
            )


            const [bookId] = results[1]

            return bookId

        } catch (err) {
            console.log(err);
        }


    }

    updateIntoBookTableValues = async(payload) => {
        let newBook = new BookEntity(payload)
        try {
            const UpdateQueryString = newBook.getUpdateQueryString()
            if (!UpdateQueryString) {
                return 0
            }
            const [results, fields] = await connection.query(
                `UPDATE ${table.BOOK} SET
            ${UpdateQueryString}
            WHERE book_id = ${payload.bookId}
            `
            )
            return 1
        } catch (err) {
            console.log(err);
        }

    }

    insertIntoBookCategoryTableValues = async(payload) => {
        let newBookCategory = new Book_CategoryEntity(payload)
        let queryString = newBookCategory.getQueryString()
        try {
            const [results, fields] = await connection.query(
                `INSERT INTO ${table.BOOK_CATEGORY} VALUES ${queryString};
                `
            )
            return results
        } catch (err) {
            console.log(err);
        }


    }

    deleteBookAnotation = async(bookId) => {
        try {
            const [results, fields] = await connection.query(
                `DELETE FROM ${table.ANOTATION}
                WHERE book_id = ${bookId};
                `
            )
            return results
        } catch (err) {
            console.log(err);
        }
    }

    deleteBook = async(bookId) => {
        try {
            const [results, fields] = await connection.query(
                `DELETE FROM ${table.BOOK}
                WHERE book_id = ${bookId};
                `
            )
            return results
        } catch (err) {
            console.log(err);
        }

    }

    deleteBookStorage = async(bookId) => {
        try {
            const [results, fields] = await connection.query(
                `DELETE FROM ${table.STORAGE}
                    WHERE book_id = ${bookId};
                    `
            )
            return results
        } catch (err) {
            console.log(err);
            throw new InternalServerError("errror in DB")
        }
    }
    deleteBookCategory = async(bookId) => {

        try {
            const [results, fields] = await connection.query(
                `DELETE FROM ${table.BOOK_CATEGORY}
                    WHERE book_id = ${bookId};
                    `
            )
            return results
        } catch (err) {
            console.log(err);
            throw new InternalServerError("errror in DB")
        }



    }

    countBookWithUserId = async(userId) => {
        const [result, fields] = await connection.query(`
            SELECT COUNT(*) AS SUM
            FROM Book 
            WHERE user_id = ${userId}
        `)

        return result
    }
    countEntitiesWithFilter = async(category) => {

        const [result, fields] = await connection.query(`
            SELECT COUNT(*) AS SUM
            FROM (
                SELECT book_id
                FROM book_category
                WHERE category_id IN (?)
                GROUP BY book_id
                HAVING COUNT(DISTINCT category_id) = ?
            ) AS matched_books;
        `, [category, category.length])

        return result
    }

    getBooksUpload = async(userId, title) => {
        const [results, fields] = await connection.query(
            `CALL GetBooksByUserAndTitle(${userId}, '${title}');

            `)
           
        return results
    }


    getBooks = async(field, LIMIT, OFFSET) => {
        const [results, fields] = await connection.query(
            `SELECT ${field} FROM ${table.BOOK}
             WHERE isPublic = true
             LIMIT ${LIMIT}
             OFFSET ${OFFSET} 
            `
        )
        return results
    }
    countBooksWithUserId = async(userId) => {

        }
        //get only user's book
    getUserBooksWithFilter = async(LIMIT, OFFSET, userId) => {
            console.log('LOL');
            const [results, fields] = await connection.query(
                `SELECT * 
            FROM book
            WHERE user_id = ${userId}
            LIMIT ${LIMIT}
            OFFSET ${OFFSET};
            `)
            return results
        }

    getUserBookAll = async (userId) => {
        try{
            const [results, fields] = await connection.query(
                `SELECT * 
            FROM book
            WHERE user_id = ${userId}
          
            `)
            return results
        }catch(err){
            console.log(err);
        }
       
    }

        //get All book
    getBooksWithFilter = async(field, category, LIMIT, OFFSET) => {
        const [results, fields] = await connection.query(
            `SELECT ${field} 
            FROM book
            WHERE book_id IN (
                SELECT book_id
                FROM book_category
                WHERE category_id IN (?)
                GROUP BY book_id
                HAVING COUNT(DISTINCT category_id) = ?
            ) AND isPublic = true
            LIMIT ${LIMIT}
            OFFSET ${OFFSET};
            `, [category, category.length])
        console.log('result: ', results);
        return results
    }

    getCategories = async(bookId) => {
        const [results, fields] = await connection.query(
            `SELECT category_id, name_category 
            FROM ${table.BOOK_CATEGORY} JOIN ${table.CATEGORY} USING(category_id)
            WHERE book_id = ${bookId}
            `
        )
        return results

    }

    getOneBookById = async(field, bookId) => {

        const [results, fields] = await connection.query(
            `SELECT ${field}
            FROM ${table.BOOK}
            WHERE book_id = ${bookId}
            `
        )
        console.log(results);
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
    loadAnotation = async({ bookId, userId }) => {
        const [result, fields] = await connection.query(
            `SELECT xml_data FROM ${table.ANOTATION}
            WHERE book_id = ${bookId} AND user_id = ${userId}
            `
        )
        let [xml] = result
        return xml
    }

    saveAnotation = async({ bookId, userId, xml }) => {

        const [result, fields] = await connection.query(
            `SELECT COUNT(*) FROM ${table.ANOTATION}
            WHERE book_id = ${bookId} AND user_id = ${userId}
            `
        )
        const isExistsAnotation = result[0]["COUNT(*)"]

        if (isExistsAnotation) { //record exists
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
        } else {
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