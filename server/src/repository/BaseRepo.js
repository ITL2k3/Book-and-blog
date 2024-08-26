import connection from "../dbs/init.mysql.js"


class BaseRepo {
    showTable = async () => {
        const [results, fields] = await connection.query(`SHOW tables`)
        return results
    }
    countAllEntities = async (table) => {
        const [results, fields] = await connection.query(
            `SELECT COUNT(*) as SUM
            FROM ${table}`
        )
        
        return results
    }
    getAllEntityFromTable = async (table) => {
        const [results, fields] = await connection.query(
            `SELECT *
            FROM ${table}
            LIMIT 5;
            `)
        return results
    }
    insertIntoTableValues = () => {}
    getValuesById = () => {}
}
export default BaseRepo