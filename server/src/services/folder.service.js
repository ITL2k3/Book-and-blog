import { BadRequestError } from "../common/error.response.js"
import FolderRepo from "../repository/FolderRepo.js"
import BookService from "./book.service.js"

const folderHelper = new FolderRepo()
class FolderService{

    static getAllFolderOfOneUser = async (userId) => {
        const result = await folderHelper.getAllFolder(userId)
        return result
    }
    //called when sign up account
    static initFolder = async (userId) => {
        await folderHelper.initFolderRepo(userId, "Thư mục gốc", false, false, true)
        await folderHelper.initFolderRepo(userId, "Thư mục chia sẻ",true, false, false)
        await folderHelper.initFolderRepo(userId, "Thư mục yêu thích", false, true, false)
        return {
            message: "created"
        }
    }

    // static checkDocExists = async(bookId) => {
        
    // }

    static addFolder = async (userId, nameFolder) => {
        const result = await folderHelper.addFolderRepo(userId, nameFolder)

        const {insertId} = result

        const {last_update} = await folderHelper.getDateCreateOfFolder(insertId)
        return {
            last_update,
            folder_id: insertId,
            user_id: userId,
            name: nameFolder
        }
    }

    static updateNameFolder = async (userId, nameFolder, folderId) => {
        const result = await folderHelper.updateNameFolder(nameFolder,folderId,userId)
        return result
    }

    static deleteFolder = async (userId, folderId, isSharedFolder) => {

        if(isSharedFolder == 'true'){
            throw new BadRequestError('Can not delete share Folder!')
        }

        const result = await folderHelper.deleteFolder(folderId, userId)
        return result
    }

   

    static addDocToFolder = async (bookId, folderId) => {
        //check if bookId exists
       
        const isBookExists = await BookService.checkDocExists(bookId)
     
        if(!isBookExists) {
            throw new BadRequestError("Doc not Found!")
        }
        const result = await folderHelper.addDoctoFolder(folderId, bookId)
        return result
    }

    static getDocFromFolder = async(folderId) => {
        const result = await folderHelper.getDocFromFolder(folderId)
        return result
    }

    static deleteDocFromFolder = async(folderId, bookId) => {
        const result = await folderHelper.deleteDocFromFolder(folderId, bookId)
        return result
    }
    //các method với tài liệu được yêu thích
    static addDocToLove = async(userId, bookId) => {
        const result = await folderHelper.addDocToLoveFolder(bookId, userId)
        return result
    }
    
    static getDocToLove = async(userId) => {
        const result = await folderHelper.getDocLove(userId)
        return result
    }

    static deleteDocLove = async(userId, bookId) => {
        const result = await folderHelper.deleteDocLove(userId, bookId)
        return result
    }

}


export default FolderService