import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication, checkPermission} from '../../Auth/checkAuth.js'
import BookController from '../../controller/book.controller.js'
import permission from '../../configs/config.permission.js'
import upload from '../../utils/uploadfile.js'
import FolderController from '../../controller/folder.controller.js'

const folderRouter = Router()








// check auth

folderRouter.use('/', asyncHandler(authentication))
//passed
folderRouter.get('/', async (req, res) => {
    res.send({
        statusCode: 200,
        statusText: 'authen success',
        userId: req.user.userId
    })
})

//method for manage folder
folderRouter.get('/get-folder', asyncHandler(FolderController.getAllFolderOfOneUser))
folderRouter.post('/add-folder', asyncHandler(FolderController.addFolder))
folderRouter.patch('/update-name-folder', asyncHandler(FolderController.updateNameFolder))
folderRouter.delete('/delete-folder', asyncHandler(FolderController.deleteFolder))
//method for manage doc in folder
folderRouter.get('/get-doc-from-folder/:id', asyncHandler(FolderController.getDocFromFolder))
folderRouter.post('/add-doc-to-folder', asyncHandler(FolderController.addDocToFolder))
folderRouter.delete('/delete-doc-from-folder', asyncHandler(FolderController.deleteDocFromFolder))
//method for manage doc love
folderRouter.get('/get-love-doc', asyncHandler(FolderController.getDocLove))
folderRouter.post('/add-doc-love', asyncHandler(FolderController.addDocLove))
folderRouter.delete('/delete-doc-love/:bookId', asyncHandler(FolderController.deleteDocLove))
//method for manage share folder
folderRouter.post('/share-doc', asyncHandler(FolderController.shareDocToAnotherAccount))




export default folderRouter