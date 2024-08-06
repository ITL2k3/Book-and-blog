import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import expressLogger from 'express-logger'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express()

//init middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(compression())


switch (app.get('env')){
    case 'development':
        app.use(morgan('dev'))
        app.use(helmet())
        break;
    case 'production':
        app.use(expressLogger({
            path: __dirname + '/log/requests.log'
        }))
}

//init db
import('./dbs/init.mysql.js')
import('./dbs/init.tables.js')
//init routes
import router from './routes/index.js'

app.use('',router)
// app.use('', require('./routes'))

//error handler
app.use((error,req,res,next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'

    })
})


export default app