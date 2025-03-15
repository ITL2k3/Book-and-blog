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



    countUser = async() => {
        const [results, fields] = await connection.query(
            `SELECT COUNT(*)  FROM ${table.USER}`
        )
        return results
    }

    getNewUserByMonth = async() => {
        const [results, fields] = await connection.query(
            `SELECT DATE_FORMAT(create_at, '%Y-%m') AS month, COUNT(*) AS total 
            FROM ${table.USER}
            GROUP BY month
            ORDER BY month`
        )
        return results
    }

    getTotalActionOfUser = async() => {
        const [results, fields] = await connection.query(
            `SELECT COUNT(*) FROM ${table.USER_ACTIVITY_LOG}`
        )
        return results
    }

    getTopPopularActions = async() => {
        const [results, fields] = await connection.query(
            `SELECT action_type, COUNT(*) AS total 
            FROM ${table.USER_ACTIVITY_LOG}
            GROUP BY action_type
            ORDER BY total DESC
            LIMIT 5`
        )

        return results
    }

    getTopNotifiedUsers = async() => {
        const [results, fields] = await connection.query(
            ` SELECT 
    u.user_id,
    u.name AS name,
    u.email as email,
    COUNT(n.notification_id) AS total_notifications
FROM notification n
JOIN user u ON n.user_id = u.user_id
GROUP BY u.user_id, u.name
ORDER BY total_notifications DESC
LIMIT 5;`
        )

        return results
    }

}

export default AccountRepo