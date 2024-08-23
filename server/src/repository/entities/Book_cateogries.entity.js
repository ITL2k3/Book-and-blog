
class Book_CategoryEntity {
    _bookId
    _categoryId
   

    constructor({bookId, categoryId}){
        this._bookId = bookId
        this._categoryId = categoryId
    }

    getQueryString(){
        return `(${this._bookId}, '${this._categoryId}')`
    }

    
}

export default Book_CategoryEntity