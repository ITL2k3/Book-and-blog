import mysql from 'mysql2/promise'
import config from '../configs/config.mysql.js'

const {db : {host, user, password, database}} = config


class Database {
    constructor(){
        return this.connect()
    }
    async connect(type = 'mysql'){
        const connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
           
        })
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
        await connection.query( `USE ${database}`)
        
        return this.connection = connection
        
    }
    static async getInstance(){
        if(!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const connection = await Database.getInstance()

// console.log(connection2)


export default connection