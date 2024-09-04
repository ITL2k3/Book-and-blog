import { Router } from 'express'
import accessRouter from './access/index.js'
import bookRouter from './book/index.js'

const router = Router()

//check api key

//

router.use('/v1/api', accessRouter)
router.use('/v1/api', bookRouter)


export default router