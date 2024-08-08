import BaseRepo from "./BaseRepo.js";
import connection from "../dbs/init.mysql.js";
import KeyTokenEntity from "./entities/keytoken.entity.js";
import table from "../configs/config.table.js";


class KeyTokenRepo extends BaseRepo {

    insertIntoTableValues = async(data) => {
        let keyTokenEntity = new KeyTokenEntity(data)
        const query = keyTokenEntity.getQueryString()

        const [results, fields] = await connection.query(`
                INSERT INTO ${table.KEYTOKEN} VALUES
                ${query}
            `)

        console.log(results, fields)

        return results

    }

    getKeyTokenByUserId = async (userId) => {
        const [results, fields] = await connection.query(`
                SELECT token_key FROM ${table.KEYTOKEN}
                WHERE user_id = ${userId}
            `)
    

        return results[0]
    }

}

export default KeyTokenRepo