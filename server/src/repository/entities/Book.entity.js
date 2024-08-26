class BookEntity {
    book_id
    title
    author
    description
    thumbnail
    filepath

    constructor({ bookId, title, author, description, thumbnail, filepath }) {
        this.book_id = bookId ? bookId : 'default'
        this.title = title ? title : null
        this.author = author ? author : null
        this.description = description ? description : null
        this.thumbnail = thumbnail ? thumbnail : null
        this.filepath = filepath ? filepath : null
    }

    getQueryString() {
        return `(${this.book_id},'${this.title}', '${this.author}','${this.description}'
        ,'${this.thumbnail}', '${this.filepath}'
        )`
    }

    getUpdateQueryString() {
        let result = `  `
        Object.entries(this).map(([key, value]) => {
            if (key != 'book_id') {
                if (value != null)
                    result += `${key} = '${value}', `
            }
        })




        return result.slice(0, -2)

    }




}

export default BookEntity