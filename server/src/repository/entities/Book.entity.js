
class BookEntity {
    _bookId
    _title
    _author 
    _description
    _quantity
    _thumbnail
    

    constructor({title, author, description, quantity, thumbnail}){
        this._bookId = 'default'
        this._title = title
        this._author = author
        this._description = description ? description : null
        this._quantity = quantity ? quantity : null
        this._thumbnail = thumbnail ? thumbnail : null
    }

    getQueryString(){
        return `(${this._bookId},'${this._title}', '${this._author}','${this._description}'
        ,${this._quantity},'${this._thumbnail}'
        )`
    }

    
}

export default BookEntity