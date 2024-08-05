import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import expressLogger from 'express-logger'
import helmet from 'helmet'
import compression from 'compression'
const app = express()
//init middleware
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



export default app