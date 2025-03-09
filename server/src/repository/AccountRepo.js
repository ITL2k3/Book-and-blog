import { InternalServerError } from "../common/error.response.js";
import table from "../configs/config.table.js";
import connection from "../dbs/init.mysql.js";
import BaseRepo from "./BaseRepo.js";



class AccountRepo extends BaseRepo {

    getAccountById = async(id) => {
        const [result, fields] = await connection.query(`
                SELECT user_id, name, role FROM ${table.USER} WHERE user_id = ?
            `, [id])

        return result
    }

    getAllAccount = async() => {
        const [result, fields] = await connection.query(`
                SELECT user_id, name, email, role, create_at FROM ${table.USER}
            `)
        return result
    }

    deleteAccount = async(id) => {
        const [result, fields] = await connection.query(`
               CALL DeleteUser( ? );
            `, [id])
        return result
    }

    updateRole = async(id, role) => {
        const [result, fields] = await connection.query(`
                UPDATE ${table.USER} SET role = ? WHERE user_id = ?
            `, [role, id])
        return result
    }


}

export default AccountRepo