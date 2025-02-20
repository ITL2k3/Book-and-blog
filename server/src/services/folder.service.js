import { BadRequestError, NotFoundError } from "../common/error.response.js"
import FolderRepo from "../repository/FolderRepo.js"
import UserRepo from "../repository/UserRepo.js"
import BookService from "./book.service.js"

const folderHelper = new FolderRepo()
const userHelper = new UserRepo()
class FolderService{

    static getAllFolderOfOneUser = async (userId) => {
        const result = await folderHelper.getAllFolder(userId)
        return result
    }

    static getOneFolderOfOneUser = async (userId, folderId) => {
        const [result] = await folderHelper.getOneFolder(userId, folderId)
        return result.is_shared_folder
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
        const isDefaultFolder = await folderHelper.checkDefaultFolder(folderId)
        if(isDefaultFolder) throw new BadRequestError('Can not rename default Folder')
        const result = await folderHelper.updateNameFolder(nameFolder,folderId,userId)
        return result
    }

    static deleteFolder = async (userId, folderId, isSharedFolder, isRootFolder, isLovedFolder) => {
     
        if(isSharedFolder == 1 || isRootFolder == 1 || isLovedFolder == 1){
            throw new BadRequestError('Can not delete default Folder!')
        }

        const result = await folderHelper.deleteFolder(folderId, userId)
        return result
    }

   

    static addDocToFolder = async (bookId, folderId, userId) => {
        //check if user add to folder share
        const isUserAddToShareFolder = await this.getOneFolderOfOneUser(userId, folderId)
        if(isUserAddToShareFolder) throw new BadRequestError("Share folder is only permitted When add from other account!",400.1)

        //check if bookId exists
       
        const [isBookExists] = await BookService.checkDocExists(bookId)
        
        if(!isBookExists) {

            throw new BadRequestError("Doc not Found!")
        }
        const result = await folderHelper.addDoctoFolder(folderId, bookId)
        return result
    }


    static shareDocToAnotherAccount = async (bookId, destUserAccountId) => {
        //check if destination user account id exists?
        const [isExistUserId] = await userHelper.getInfoAccount(destUserAccountId)
        console.log(isExistUserId);
        if(!isExistUserId) throw new NotFoundError('User not found!', 400.1)

        //check if bookId exists
       
        const [isBookExists] = await BookService.checkDocExists(bookId)
        
        if(!isBookExists) {

            throw new NotFoundError('Book not found!', 400)
        }
        //get shared folder id 
 
        const shareFolderId = await folderHelper.getShareFolderId(destUserAccountId)
        //add doc to shared folder
        console.log(shareFolderId);
        await folderHelper.addDoctoFolder(shareFolderId, bookId)

        return 1

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