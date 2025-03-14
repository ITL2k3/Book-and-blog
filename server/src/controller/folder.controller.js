import { BadRequestError } from "../common/error.response.js"
import { SuccessResponse } from "../common/success.response.js"
import FolderService from "../services/folder.service.js"
import LogService from "../services/log.service.js"

class FolderController{

    getAllFolderOfOneUser = async (req, res, next) => {
        const userId = req.user.userId
       
        //send to service
        const result = await FolderService.getAllFolderOfOneUser(userId)
        new SuccessResponse({
            message: "get folder success",
            metadata: result
        }).send(res)
    }


    addFolder = async(req, res, next) => {
        //take data from client
        const userId = req.user.userId
        const {nameFolder} = req.body
        //send to service
        const result = await FolderService.addFolder(userId, nameFolder)
        new SuccessResponse({
            message: "create folder success",
            metadata: result
        }).send(res)
    }

    updateNameFolder = async(req, res, next) => {
        const {nameFolder, folderId} = req.body
      
        const userId = req.user.userId
        new SuccessResponse({
            message: "update name success",
            metadata: await FolderService.updateNameFolder(userId, nameFolder, folderId)
        }).send(res)
    }

    deleteFolder = async(req, res, next) => {
        const {folderId, isSharedFolder, isLovedFolder, isRootFolder} = req.query
        console.log( isSharedFolder, isLovedFolder, isRootFolder);
        //if information is not enough, throw error
        if(isSharedFolder === undefined || isLovedFolder === undefined || isRootFolder === undefined){
            throw new BadRequestError("Đề nghị truyền đẩy đủ thông tin!")
        }
        const userId = req.user.userId
        
        new SuccessResponse({
            message: "update name success",
            metadata: await FolderService.deleteFolder(userId,folderId, isSharedFolder, isRootFolder, isLovedFolder)
        }).send(res)
    }


    addDocToFolder = async(req, res, next) => {
        const {folderId, bookId} = req.body
        const userId = req.user.userId
        //Ghi lại lịch sử hoạt động của người dùng
        LogService.writeUserActivityLog(userId, 'add-doc-to-folder', `user ${userId} add document ${bookId} to folder`)
        new SuccessResponse({
            message: "post doc to folder success",
            metadata: await FolderService.addDocToFolder(bookId, folderId, userId)
        }).send(res)
    }

    shareDocToAnotherAccount = async(req, res, next) => {
        const {destUserId, bookId} = req.body
        new SuccessResponse({
            message: "Share doc success",
            metadata: await FolderService.shareDocToAnotherAccount(bookId, destUserId)
        }).send(res)
    }



    getDocFromFolder = async(req, res, next) => {
        const folderId = req.params.id
        new SuccessResponse({
            message: "get doc success",
            metadata: await FolderService.getDocFromFolder(folderId)
        }).send(res)
    }

    deleteDocFromFolder = async(req, res, next) => {
        const {folderId, bookId} = req.query 
        new SuccessResponse({
            message: "get doc success",
            metadata: await FolderService.deleteDocFromFolder(folderId, bookId)
        }).send(res)
    }

    addDocLove = async (req, res, next) => {
        const userId = req.user.userId

        const {bookId} = req.body

        new SuccessResponse({
            message: "add doc to love folder success",
            metadata: await FolderService.addDocToLove(userId, bookId)
        }).send(res)
    }

    getDocLove = async (req, res, next) => {
        const userId = req.user.userId
        new SuccessResponse({
            message: "get success",
            metadata: await FolderService.getDocToLove(userId)
        }).send(res)
    }

    deleteDocLove = async (req, res, next) => {
        const userId = req.user.userId
        const bookId = req.params.bookId
        new SuccessResponse({
            message: "delete success",
            metadata: await FolderService.deleteDocLove(userId, bookId)
        }).send(res)
    }




}

export default new FolderController