class BookEntity {
    book_id
    user_id
    title
    author
    isPublic
    num_of_views
    description
    thumbnail
    filepath


    constructor({ bookId, userId, title, author, isPublic, num_of_views, description, thumbnail, filepath }) {
        this.book_id = bookId ? bookId : 'default'
        this.user_id = userId ? userId : null
        this.title = title ? title : null
        this.author = author ? author : null
        this.isPublic = isPublic ? isPublic : false
        this.num_of_views = num_of_views ? num_of_views : 0
        this.description = description ? description : null
        this.thumbnail = thumbnail ? thumbnail : null
        this.filepath = filepath ? filepath : null
    }

    getQueryString() {
        return `(${this.book_id}, ${this.user_id}, '${this.title}', '${this.author}', ${this.isPublic}, ${this.num_of_views}, '${this.description}'
        ,'${this.thumbnail}', '${this.filepath}', default, default)`
    }

    getUpdateQueryString() {
        let result = `  `
        Object.entries(this).map(([key, value]) => {
            if (key != 'book_id') {
                if(key == 'isPublic'){
                    result += `${key} = ${value}, `
                }else if (value != null){
                    result += `${key} = '${value}', `
                }
                    
            }
        })
        



        return result.slice(0, -2)

    }




}

export default BookEntity