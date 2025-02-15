class FolderEntity {
    folder_id
    user_id
    name
    is_shared_folder
    is_loved_folder
    is_root_folder

    constructor({ folderId, userId, nameFolder, isSharedFolder, isLovedFolder, isRootFolder}) {
        this.folder_id = folderId ? folderId :'default'
        this.user_id = userId ? userId : null
        this.name = nameFolder ? nameFolder : null
        this.is_shared_folder = isSharedFolder ? isSharedFolder : false
        this.is_loved_folder = isLovedFolder ? isLovedFolder : false
        this.is_root_folder = isRootFolder ? isRootFolder : false

    }

    getQueryString() {
        return `(${this.folder_id}, ${this.user_id}, '${this.name}', ${this.is_shared_folder},${this.is_loved_folder}, ${this.is_root_folder}, default, default)`
    }


    



}

export default FolderEntity