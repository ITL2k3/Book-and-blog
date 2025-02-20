import table from "../configs/config.table.js";
import connection from "../dbs/init.mysql.js";
import BaseRepo from "./BaseRepo.js";
import FolderEntity from "./entities/Folder.entity.js";




class FolderRepo extends BaseRepo {
    getAllFolder = async(userId) => {
        const [result, fields] = await connection.query(`
                SELECT * FROM ${table.FOLDER} 
                WHERE user_id = ?
               
            ;`, [userId])
        return result
    }
    getOneFolder = async(userId, folderId) => {
        const [result, fields] = await connection.query(`
                SELECT * FROM ${table.FOLDER} 
                WHERE user_id = ?
                AND folder_id = ?
               
            ;`, [userId, folderId])
        return result
    }
    getDateCreateOfFolder = async(folderId) => {
        // Truy vấn lại để lấy `create_at`
        const [folder] = await connection.query(`
        SELECT  *
        FROM ${table.FOLDER} 
        WHERE folder_id = ?
    `, [folderId]);

        return folder[0]; // Trả về thư mục với `create_at`
    }

    addFolderRepo = async(userId, nameFolder) => {
        const folderObject = new FolderEntity({ userId, nameFolder})
        const queryInsertFolder = folderObject.getQueryString()


        const [result, fields] = await connection.query(`
            INSERT INTO ${table.FOLDER} VALUES
            ${queryInsertFolder}
        `)

        return result

    }

    initFolderRepo = async(userId, nameFolder, isSharedFolder, isLovedFolder, isRootFolder) => {
        const folderObject = new FolderEntity({ userId, nameFolder, isSharedFolder, isLovedFolder, isRootFolder })
        const queryInsertFolder = folderObject.getQueryString()


        const [result, fields] = await connection.query(`
            INSERT INTO ${table.FOLDER} VALUES
            ${queryInsertFolder}
        `)

        return result


    }
    checkDefaultFolder = async(folderId) => {
        const [result, fields] = await connection.query(`
                SELECT * FROM ${table.FOLDER}
                WHERE folder_id = ${folderId}
            `)
        const [folder] = result

        if(folder.is_shared_folder == 0 && folder.is_loved_folder == 0 && folder.is_root_folder == 0){
            return false
        }else{
            return true
        }
      
    }
    updateNameFolder = async(nameFolder, folderId, userId) => {

        const [result, fields] = await connection.query(`
                UPDATE ${table.FOLDER}
                SET name = "${nameFolder}"
                WHERE folder_id = ${folderId} AND user_id =${userId}
              
            `)

        return result


    }


    deleteFolder = async(folderId, userId) => {
        const [result, fields] = await connection.query(`
            DELETE FROM ${table.FOLDER}
            WHERE folder_id = ${folderId} AND user_id =${userId} 
          
        `)

        return result

    }
    getDocFromShareFolder = async(folderId) => {
        const [result, fields] = await connection.query(`
            SELECT b.*
            FROM ${table.FOLDER_BOOK} fb
            JOIN book b ON fb.book_id = b.book_id
            WHERE fb.folder_id = ${folderId}
        `)
        return result
    }
    getDocFromFolder = async(folderId) => {
        const [result, fields] = await connection.query(`
            SELECT b.*
            FROM ${table.FOLDER_BOOK} fb
            JOIN book b ON fb.book_id = b.book_id
            WHERE fb.folder_id = ${folderId} AND b.isPublic = true
        `)
        return result
    }

    
    addDoctoFolder = async(folderId, bookId) => {
        const [result, fields] = await connection.query(`
            INSERT INTO ${table.FOLDER_BOOK} VALUES
            (${folderId}, ${bookId})
        `)
        return result
    }
    deleteDocFromFolder = async(folderId, bookId) => {
        const [result, fields] = await connection.query(`
            DELETE FROM ${table.FOLDER_BOOK}
            WHERE book_id = ${bookId} AND folder_id = ${folderId}
        `)
        return result
    }

    getShareFolderId = async(userId) => {
        const [result, fields] = await connection.query(`
            SELECT * FROM ${table.FOLDER}
            WHERE user_id = ? AND is_shared_folder = 1
            `, [userId])
            
        return result[0].folder_id
    }

    // addDocToLoveFolder = async(bookId, userId) => {
    //     const [result, fields] = await connection.query(`
    //         INSERT INTO ${table.BOOK_LOVE_USER} VALUE
    //         (${userId}, ${bookId})
    //     `)
    //     return result
    // }

    // getDocLove = async(userId) => {
    //     const [result, fields] = await connection.query(`
    //         SELECT * FROM ${table.BOOK_LOVE_USER} 
    //         WHERE user_id = ${userId}
    //     `)
    //     return result
    // }

    // deleteDocLove = async(userId, bookId) => {
    //     const [result, fields] = await connection.query(`
    //         DELETE FROM ${table.BOOK_LOVE_USER}
    //         WHERE book_id = ${bookId} AND user_id = ${userId}
    //     `)
    //     return result
    // }


}

export default FolderRepo