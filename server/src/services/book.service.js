import { BadRequestError, InternalServerError } from "../common/error.response.js"
import table from "../configs/config.table.js"
import client from "../dbs/init.elastic.js"
import { filterNonNullProperties } from "../Helpers/asynchandler.js"
import { deleteDataFromChatPDFAPI } from "../Helpers/fetchdata.js"
import BookRepo from "../repository/BookRepo.js"
import { getFilepathFromString } from "../utils/index.js"
import fs from 'fs/promises'


import Fs from 'fs'
import pdf from 'pdf-parse'

const bookHelper = new BookRepo()
class BookService {

    static getReferenceDoc = async(category) => {



        const limitRecord = 10
        const result = await bookHelper.getReferencesDoc(category, limitRecord)

        console.log('res: ', result)

        return result
    }

    static getSourceIdPDF = async(bookId) => {
        const [result] = await bookHelper.getSourceId(bookId)
        return result.source_id_chatPDF
    }

    static upViewsBook = async(bookId) => {

        await bookHelper.upNumViewBook(bookId);
        return true
    }


    static searchBooks = async(query) => {
        const result = await client.search({
            index: 'docs',
            query: {
                bool: {
                    must: {
                        multi_match: {
                            query: query,
                            fields: ["title", "author"]
                        }
                    },
                    filter: {
                        term: {
                            isPublic: true // Lọc các tài liệu có isPublic là true
                        }
                    }
                }
            }
        });

        console.log(result.hits.hits);
        return result.hits.hits

    }

    static searchBooksAdvance = async({ content, numPages, creationDate, page = 1 }) => {

        const size = 1;
        const from = (page-1)*size
        const query = {
                bool: {
                    must: [{
                        term: {"isPublic": "true"} //doc must be public
                    }],
                    filter: []
                }
            }
            //if request contain content
        if (content) {
            query.bool.must.push({
                match_phrase: {
                    "content.text": content
                }
            })
        }
        //if request contain numpages
        if (numPages) {
            query.bool.filter.push({
                range: {
                    "content.info.numpages": {
                        "gte": numPages.min, // Số trang tối thiểu
                        "lte": numPages.max // Số trang tối đa
                    }
                }
            })
        }
        //if request contain creationDate
        if (creationDate) {
            query.bool.filter.push({
                range: {
                    "content.info.CreationDate": {
                        "gte": creationDate.start, // Ngày bắt đầu
                        "lte": creationDate.end // Ngày kết thúc
                    }
                }
            })
        }


        const result = await client.search({
            index: 'docs', // Tên index
        
            body: {
                query: query,
                _source: ["title", "author", "thumbnail"],
                from, //start record
                size //record number 
            }
        });

        const totalOfRecord = (await client.count({
            index: 'docs'
        })).count


        return {
            totalOfRecord,
            numOfRecordHit: result.hits.total.value,
            page: page,
            records: result.hits.hits,
            
        }

    }



    static countBooksWithUserId = async(userId) => {
        const [results] = await bookHelper.countBookWithUserId(userId)
        console.log('book is', results);
        return results
    }
    static countBooks = async(Filter) => {
        if (Filter) {
            if (typeof Filter == 'string') {
                Filter = [Filter]
            }
            const [results] = await bookHelper.countEntitiesWithFilter(Filter)
            return results
        }
        const [results] = await bookHelper.countAllEntities()
        return results
    }
    static getUserBooks = async(page, userId) => {

        const LIMIT = 8;
        const OFFSET = (page - 1) * LIMIT


        let books = await bookHelper.getUserBooksWithFilter(LIMIT, OFFSET, userId)






        return books
    }

    static getBooks = async(page, option, Filter) => {
        const LIMIT = 15;
        const OFFSET = (page - 1) * LIMIT
        let fields = ''
        if (option == 'Home') {
            fields = 'book_id, title, author, thumbnail'
        } else if (option == 'update-book') {
            fields = '*'
        }
        let books
        if (Filter) {
            if (typeof Filter == 'string') {
                Filter = [Filter]
            }
            books = await bookHelper.getBooksWithFilter(fields, Filter, LIMIT, OFFSET)

            // const result = await Promise.all(
            //     books.map(async (book) => {

            //         let categories = await bookHelper.getCategories(book.book_id)

            //         return {...book,...{categories}}
            //     })
            // ) 
        } else {
            books = await bookHelper.getBooks(fields, LIMIT, OFFSET)

        }



        return books
    }



    static getOneBook = async(id) => {
        const [result] = await bookHelper.getOneBookById('*', id)
        const categories = await bookHelper.getCategories(result.book_id)
        const stringRes = categories.map(category => category.name_category)
        console.log(stringRes);
        return {
            ...result,
            categories: stringRes
        }
    }



    //for user
    static insertBook = async(payload) => {

        console.log(payload);
        //insert book and get bookId 
        const bookId = await bookHelper.insertIntoBookTableValues(payload)
        console.log('first success');
        //take key of not null value
        const categories = Object.entries(payload.categories).filter(([key, value]) => value != 'null')
            .map(([key]) => key)

        categories.forEach(async(category) => {
            await bookHelper.insertIntoBookCategoryTableValues({ categoryId: category, bookId: bookId.Id })
        })


        // add to elastic


        //read file pdf and transfer to text
        let dataBuffer = await fs.readFile(`uploads/files_pdf/${payload.fileName}`)
        const stats = await fs.stat(`uploads/files_pdf/${payload.fileName}`)
       


        pdf(dataBuffer).then(async function(data) {
            const result = await client.index({
                index: "docs",
                id: `${bookId.Id}`,
                document: {
                    title: payload.title,
                    author: payload.author,
                    thumbnail: payload.thumbnail,
                    filepath: payload.filepath,
                    isPublic: payload.isPublic,
                    content: {
                        info: {
                            numpages: data.numpages,
                            CreationDate: stats.birthtime
                        },
                        text: data.text
                    }

                }
            })

        })




        //

        //not throw error <=> add success

        return {
            payload
        }

    }

    static loadAnotation = async(payload) => {
        const result = await bookHelper.loadAnotation(payload)
        return result
    }
    static saveAnotation = async(payload) => {
        console.log(payload.xml.length);
        bookHelper.saveAnotation(payload)
        return 1
    }



    static updateBook = async(payload) => {
        //if update filepath required:  
        let old_src_id_PDF
        if (payload.filepath) {


            //delete old file
            const [linkOldFilePath] = await bookHelper.getOneBookById('filepath', payload.bookId)
            try {
                fs.unlink(`uploads/files_pdf/${getFilepathFromString(linkOldFilePath.filepath)}`)
                    .catch((err) => {
                        console.log('file Not Found');
                    })
            } catch (err) {
                console.log(err);
            }

            //delete old source Id from chatPDF

            //delete soucrce id from chatPDF API 
            await deleteDataFromChatPDFAPI(payload.source_id_chatPDF) //link pdf cũ



            //cập nhật lại payload: thay giá trị src_id_chatPDF hiện tại, xóa trường src_id_chatPDF_new
            old_src_id_PDF = payload.source_id_chatPDF
            payload.source_id_chatPDF = payload.source_id_chatPDF_new
            delete payload.source_id_chatPDF_new
        }



        //update book record mysql

        await bookHelper.updateIntoBookTableValues(payload)
            //update categories record
        await bookHelper.deleteBookCategory(payload.bookId)
        const categories = Object.entries(payload.categories).filter(([key, value]) => value != 'null')
            .map(([key]) => key)

        categories.forEach(async(category) => {
            await bookHelper.insertIntoBookCategoryTableValues({ categoryId: category, bookId: payload.bookId })
        })

        //update book record elastic
        const updateDoc = filterNonNullProperties(payload, ['title', 'author', 'isPublic', 'filepath', 'thumbnail'])
        await client.update({
            index: 'docs',
            id: payload.bookId,
            doc: updateDoc
        })

        //delete 
        return old_src_id_PDF


    }









    static deleteBook = async(payload) => {

        const { book_id, file } = payload
        fs.unlink(`uploads/files_pdf/${getFilepathFromString(file)}`)
            .catch((err) => {
                console.log('file Not Found');
            })
            //delete record in mysql
        await bookHelper.deleteBookStorage(book_id)

        await bookHelper.deleteBookCategory(book_id)

        await bookHelper.deleteBookAnotation(book_id)

        await bookHelper.deleteBook(book_id)
            //delete record in elastic

        await client.delete({
            index: 'docs',
            id: book_id

        })



        //delete soucrce id from chatPDF API 
        deleteDataFromChatPDFAPI(payload.src_id)



        return book_id
    }


}

export default BookService