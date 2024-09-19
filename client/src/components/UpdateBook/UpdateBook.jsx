import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { Form, Link, NavLink, Outlet, useActionData } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'
import ReactPaginate from 'react-paginate'


// const useCookieState(){

// }




function Items() {
    const [data, setData] = useState(null)
    const [page, setPage] = useState(1)



    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
    const [booksLength, setbooksLength] = useState(null)
    let itemsPerPage = 5;



    useEffect(() => {
        fetch(`http://localhost:3055/v1/api/Library/search?page=${page}&option=update-book`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
            console.log(res);
            const messageText = await res.text()

            const finalRes = JSON.parse(messageText)
            setbooksLength(finalRes.metadata.sumOfBooks)
            setData(finalRes.metadata.results)
        })
    }, [])



    useEffect(() => {
        // Fetch items from another resources.
        setCurrentItems(data);
        setPageCount(Math.ceil(booksLength / itemsPerPage));
    }, [data]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        fetch(`http://localhost:3055/v1/api/Library/search?page=${event.selected + 1}&option=update-book`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
            console.log(res);
            const messageText = await res.text()

            const finalRes = JSON.parse(messageText)
            setData(finalRes.metadata.results)
        })
        // console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        // setItemOffset(newOffset);
    };




    const [isFormVisible, setIsFormVisible] = useState(false);
    const [dataForm, setDataForm] = useState(null)
    const actionData = useActionData()

    const handleEditClick = () => {
        setIsFormVisible(true)
    }










    if (data != null) {
        return (
            <>
                <div className="library-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>description</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            { data.map((book) => {
                                return (
                                    <tr key={ book.book_id }>
                                        <td><img src={ book.thumbnail } alt="" width="200" height="200" /></td>
                                        <td><p>{ book.title }</p></td>
                                        <td><p>{ book.author }</p></td>
                                        <td><p>{ book.description }</p></td>
                                        <td><button onClick={ () => {
                                            fetch(`http://localhost:3055/v1/api/lib/delete-book?file=${book.filepath}&book_id=${book.book_id}`, {
                                                method: 'delete',
                                                credentials: 'include'
                                            }).then((res) => {
                                                window.location.reload()
                                            })
                                        } }>Xóa</button>
                                            <button onClick={ () => {
                                                setDataForm(book)
                                                handleEditClick()

                                            } }>Sửa</button></td>
                                    </tr>
                                )
                            }) }
                        </tbody>

                    </table>


                    {/* { data.map((book) => {
                    
                    return (
                        <div className = 'bookitem'>
                            <a href={`/detail/${book.title}_${book.book_id}`}>
                          
                            <img src={ book.thumbnail } alt="" width = "200" height = "200" />
                            <p>Tiêu đề: { book.title }</p>
                            <p>Tác giả: { book.author }</p>
                            </a>
                           

                        </div>
                    )

                }) } */}
                </div>

                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={ handlePageClick }
                    pageRangeDisplayed={ 3 }
                    marginPagesDisplayed={ 2 }
                    pageCount={ pageCount }
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={ null }
                />
                { isFormVisible && (

                    <Form method='put' action="/update-book" encType='multipart/form-data'>
                        <button onClick={ () => {
                            setIsFormVisible(false)
                        } }>Close</button>
                        <h3>Cập Nhật Sách</h3>
                        <input type="text" name='bookId' value={ dataForm.book_id } style={ { display: 'none' } } />
                        <label>
                            <span>Tiêu đề</span>
                            <input type='text' placeholder={ dataForm.title } name='title' />
                        </label>
                        <br />
                        <label>
                            <span>Tác giả</span>
                            <input type='text' placeholder={ dataForm.author } name='author' />
                        </label>
                        <div>
                            <span>Thể loại: </span><br />
                            <input type='checkbox' name='categories01' value='kns' id='category01' />
                            <label for='category01'>Kỹ năng sống</label> <br />
                            <input type='checkbox' name='categories02' value='kt' id='category02' />
                            <label for='category02'>Kinh tế</label> <br />
                            <input type='checkbox' name='categories03' value='tc' id='category03' />
                            <label for='category03'>Tài chính</label> <br />
                            <input type='checkbox' name='categories04' value='cn' id='category04' />
                            <label for='category04'>Công nghệ</label> <br />
                            <input type='checkbox' name='categories05' value='nn' id='category05' />
                            <label for='category05'>Ngoại ngữ</label> <br />
                            <input type='checkbox' name='categories06' value='gt' id='category06' />
                            <label for='category06'>Đề cương</label> <br />
                            <input type='checkbox' name='categories07' value='dc' id='category07' />
                            <label for='category07'>Giáo trình</label> <br />
                        </div>

                        <br />
                        <label>
                            <span>Mô tả</span>
                            <input type='text' placeholder={ dataForm.description } name='description' />
                        </label>
                        <br />
                        <label>
                            <span>link Ảnh: </span>
                            <input type='text' name='thumbnail' />
                        </label>
                        <br />
                        <label>
                            <span>File sách: </span>
                            <input type='file' accept=".pdf" name='pdf' />
                        </label>
                        <br />
                        <button>Cập Nhật</button>
                        { actionData && actionData.error && <p>{ actionData.error }</p> }

                        { actionData && actionData.success && <p>{ actionData.success }, tải lại trang sau 2s </p> }

                    </Form>
                ) }
            </>
        )

    }
}

export const updateAction = async ({ request }) => {
    const formData = await request.formData()

    //append formdata
    const payload = new FormData()
    payload.append("bookId", formData.get('bookId'))
    payload.append("title", formData.get('title'))
    payload.append("author", formData.get('author'))
    payload.append("kns", formData.get('categories01'))
    payload.append("kt", formData.get('categories02'))
    payload.append("tc", formData.get('categories03'))
    payload.append("cn", formData.get('categories04'))
    payload.append("nn", formData.get('categories05'))
    payload.append("dc", formData.get('categories06'))
    payload.append("gt", formData.get('categories07'))

    payload.append("description", formData.get('description'))

    payload.append("pdf", formData.get('pdf'))
    payload.append("thumbnail", formData.get('thumbnail'))

    const URL = 'http://localhost:3055/v1/api/lib/update-book'

    let res = await fetch(URL, {
        method: "PUT",
        body: payload,

        credentials: 'include'
    })
    res = await res.text()

    const data = await JSON.parse(res)
    if (data.statusCode == 200) {
        setTimeout(() => {
            window.location.reload()
        }, 2000)
        return {
            success: "Cập Nhật thành công"
        }
    } else if (data.statusCode == 401) {

        window.location.reload()
    } else if (data.statusCode == 400) {
        return {
            error: data.message
        }
    } else {
        return {
            error: "Sai format dữ liệu, đề nghị xem lại file ảnh hoặc sách."
        }
    }


}

export default function UpdateBook() {
    // let refreshToken = document.cookie.refresh_Token
    // let rT = Cookies.get('refresh_token')
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)



    useEffect(() => {
        checkAuth('http://localhost:3055/v1/api/lib').then((res) => {
            if (res == false) {
                setValid(false)
            } else {
                setValid(true)
                setData(res)
            }
        })
    }, [])






    if (isValid == null) {
        <p>Loading...</p>

    } else {
        if (isValid) {



            return (
                <>
                    <Items />

                </>
            )


        } else {
            // return <p>Loading...</p>
            return <p>Forbidden !!</p>
        }
    }
}
