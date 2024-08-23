
class BookEntity {
    _bookId
    _title
    _author 
    _description
    _quantity
    _thumbnail
    _filepath

    constructor({title, author, description, thumbnail, filepath}){
        this._bookId = 'default'
        this._title = title
        this._author = author
        this._description = description ? description : null
        this._thumbnail = thumbnail ? thumbnail : null
        this._filepath = filepath
    }

    getQueryString(){
        return `(${this._bookId},'${this._title}', '${this._author}','${this._description}'
        ,'${this._thumbnail}', '${this._filepath}'
        )`
    }

    

    
}

export default BookEntity