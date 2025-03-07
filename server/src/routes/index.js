import { Router } from 'express'
import accessRouter from './access/index.js'
import bookRouter from './book/index.js'
import storageRouter from './storage/index.js'
import folderRouter from './folder/index.js'
import chatRouter from './chat/index.js'
import accountRouter from './account/index.js'
const router = Router()

//check api key

//
router.use('/v1/api', accessRouter)
router.use('/v1/api', bookRouter)
router.use('/v1/api', folderRouter)
router.use('/v1/api',storageRouter)
router.use('/v1/api', chatRouter)
router.use('/v1/api', accountRouter)


export default router