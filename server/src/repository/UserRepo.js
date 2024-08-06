import table from "../configs/config.table.js";
import connection from "../dbs/init.mysql.js";
import BaseRepo from "./BaseRepo.js";
import UserEntity from "./utils/user.entity.js";



class UserRepo extends BaseRepo {
    insertIntoTableValues = async(payload) => {
        let newUser = new UserEntity(payload)
        const newUserQueryString = newUser.getQueryString()

    
            
        const [results, fields] = await connection.query(
            `INSERT INTO ${table.user} VALUES ${newUserQueryString}`
        )
        
    
        newUser = null

        return results
    }
    getValuesById = async(userId) => {
        const [results, fields] = await connection.query(
            `SELECT * FROM ${table.user}
             WHERE user_id = ${userId}
            `
        )
        return results

    }

}

export default UserRepo