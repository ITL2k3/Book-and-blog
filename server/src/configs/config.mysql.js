'use strict'

const development = {
    db: {
        host: process.env.DEV_DB_HOST || '127.0.0.1',
        user: process.env.DEV_DB_USER || 'root',
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB || 'BookBlogDev'
    }
}


const production = {
    db: {
        host: process.env.PROD_DB_HOST || '127.0.0.1',
        user: process.env.PROD_DB_USER || 'root',
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB || 'BookBlogProd'
    }
}

const config = {development, production}
const env = process.env.NODE_ENV || 'development'
export default config[env]