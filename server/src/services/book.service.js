import { BadRequestError, InternalServerError } from "../common/error.response.js"
import table from "../configs/config.table.js"
import client from "../dbs/init.elastic.js"
import { filterNonNullProperties } from "../Helpers/asynchandler.js"
import { deleteDataFromChatPDFAPI, fetchVectorFromMBertHost } from "../Helpers/fetchdata.js"
import BookRepo from "../repository/BookRepo.js"
import { getFilepathFromString } from "../utils/index.js"
import fs from 'fs/promises'


import Fs from 'fs'
import pdf from 'pdf-parse'
import io from "../../server.js"

const bookHelper = new BookRepo()
class BookService {

    static insertNoti = async (userId, message, title) => {
     
        const result = await bookHelper.insertNoti(userId, message, title)

        const notification = {
         
            message: message,
            userId: userId,
            title: title,
            report_id: result.insert_id,
            is_read: 0,
            created_at: new Date().toISOString()
        }
        io.emit('receive_notification_user', notification)
        return result.insertId
    }

    static getNotificationForUserInfo = async (is_read, userId) => {

        const report = is_read == 'null' ? await bookHelper.getAllNoti(userId) :  await bookHelper.getNoti(is_read, userId)
        
        const unreadCount = await bookHelper.countUnReadNoti(userId)
        
        
        return {
            notiMessage: report,
            unreadCount
        }
    }

    static updateNotiForUser = async(notiId, userId) => {
     
        await bookHelper.updateNoti(notiId, userId)

    }






    static insertReport = async (userId, authorId, message, bookId, title) => {
     
        const result = await bookHelper.insertReport(authorId, userId, message, bookId, title)

        
        const notification = {
            book_id: bookId,
            author_id: authorId,
            message: message,
            userId: userId,
            title: title,
            report_id: result.insert_id,
            is_read: 0,
            created_at: new Date().toISOString()
        }
        io.emit('receive_notification', notification)
        return result.insertId
    }

    static getNotificationInfo = async (is_read) => {
        const report = is_read == 'null' ? await bookHelper.getAllReport() :  await bookHelper.getReport(is_read)
        
        const unreadCount = await bookHelper.countUnRead()
        
        
        return {
            notiMessage: report,
            unreadCount
        }
    }

    static updateNoti = async(reportId) => {
        await bookHelper.updateReport(reportId)

    }

    static getReferenceDoc = async(category) => {


        const limitRecord = 10
        const result = await bookHelper.getReferencesDoc(category, limitRecord, category.length)

        console.log('res: ', result)

        return result
    }

    static getDocVector = async(bookId) => {
        try {
            // Lấy vector của một quyển sách theo bookId
            const response = await client.get({
                index: 'docs', // Thay 'docs' bằng tên index của bạn
                id: bookId // Dùng bookId để lấy tài liệu
            });

            const bookVector = response._source.content.vector; // Lấy vector từ trường 'content.vector'
            return bookVector;
        } catch (error) {
            console.error('Error fetching book vector:', error);
            return null;
        }
    }

    static getSuggestDoc = async(bookId) => {

        try {

            const queryVector = await this.getDocVector(bookId)
                // Truy vấn k-NN tìm các tài liệu gần nhất
            const response = await client.search({
                index: 'docs', // Tên index
                knn: {
                    field: "content.vector",
                    query_vector: queryVector,
                    k: 20,
                    num_candidates: 100
                },
                _source: ["title", "author"]
            });

            //filter record score>0.85
            const filteredResults = response.hits.hits.filter(hit => hit._score > 0.85);
            return filteredResults;
        } catch (error) {
            console.error('Error searching for similar books:', error);
            return [];
        }
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


    static searchBooksFromUpload = async(userId, title) => {
        const [result] = await bookHelper.getBooksUpload(userId, title)

        return result

    }

    static searchBooksAdvance = async({ content, numPages, creationDate, page = 1 }) => {

        const size = 1;
        const from = (page - 1) * size
        const query = {
                bool: {
                    must: [{
                        term: { "isPublic": "true" } //doc must be public
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
    static getUserBooks = async(userId) => {

        // const LIMIT = 8;
        // const OFFSET = (page - 1) * LIMIT
        console.log('hello', userId);

        let books = await bookHelper.getUserBookAll(userId)






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

    static checkDocExists = async(bookId) => {
    
        const result = await bookHelper.getOneBookById('*', bookId)
       
        return result
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

            const book_vector = await fetchVectorFromMBertHost(data.text)

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
                        text: data.text,
                        vector: book_vector
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
        console.log(updateDoc);
       
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
        try{
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



        return book_idF
        }catch(err){
            console.log(err);
        }
       
    }


}

export default BookService