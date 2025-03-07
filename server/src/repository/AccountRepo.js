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
}

export default AccountRepo