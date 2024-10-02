import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { Form, Link, Navigate, NavLink, Outlet, useActionData, useNavigate } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'
import InfiniteScroll from 'react-infinite-scroll-component'
import ReactPaginate from 'react-paginate'


// const useCookieState(){

// }
import './storage.css'
import { host } from '../../host'



function Items() {
    const [valid, setValid] = useState(false)
    const [books, setBooks] = useState([]);   // Quản lý trạng thái còn dữ liệu để tải
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSortDropdown, setSortShowDropdown] = useState(false);
    const [showViewDropdown, setViewShowDropdown] = useState(false);
    const [queryString, setQueryString] = useState();

    const [hasBooks, setHasBooks] = useState(false)

    const navigate = useNavigate()
    
    const fetchBooks = async () => {

        
        fetch(`http://${host}:3055/v1/api/get-books-from-storage?page=${page}`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
        
            const messageText = await res.text()

            const finalRes = JSON.parse(messageText)
            const data = finalRes.metadata
            
            if(data) setHasBooks(true)
            if(!data && page == 1) setHasBooks(false)
            console.log(data.length, page);
            if (data.length == 0) {
                setHasMore(false)
            } else {
                setBooks([...books, ...data])
            }

        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
      
        fetchBooks();
    }, [page])

    const fetchMoreData = () => {
       
        setPage(page + 1); // Tăng số trang lên để tải dữ liệu mới
    };


    // const handleSubmit = (event) => {
    //     window.scrollTo({ top: 0, behavior: 'instant' })
    //     event.preventDefault(); // Ngăn chặn hành vi mặc định của form nếu cần



    //         const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    //         const selectedCategories = Array.from(checkedBoxes).map((checkbox) => checkbox.value);
    //         const newQueryString = selectedCategories.map((category) => `category=${category}`).join('&');




    //         setQueryString(newQueryString); // Cập nhật queryString




    //         const checkedRadio = document.querySelectorAll('input[type="radio"]:checked');
    //         if (checkedRadio[0].value == 'list') {

    //             setPage(1)
    //             // setTrans(!trans)
    //             fetchDataList()

    //             setView(0)
    //         } else {

    //             setPage(1)
    //             // setTrans(!trans)
    //             fetchDataGrid()
    //             setView(1)
    //         }
    // };




    // const handleFilterClick = () => {
    //     setShowDropdown(!showDropdown);
    // };
    // const handleSortClick = () => {
    //     setSortShowDropdown(!showSortDropdown)
    // }
    // const handleViewClick = () => {
    //     setViewShowDropdown(!showViewDropdown)
    // }
    return (
      

            <div className="storage-content">
                <InfiniteScroll
                    dataLength={ books.length }
                    next={ fetchMoreData }
                    hasMore={ hasMore }
                    loader={ <h4></h4> }
                    endMessage={ <p>Hết</p> }
                >

                    <>
                        <>
                            <div className="library-view-container">
                                {
                                    books.map((book) => {

                                        return (
                                            <div className="View-bookitem" key={ book.book_id }>
                                                <img src={ book.thumbnail } alt="" />

                                                <div className="btext">
                                                    <a key={ book.book_id } href={ `/detail/${book.title}_${book.book_id}` }>
                                                        <p className="btitle">{ book.title }</p>
                                                        <p className="bauthor">Tác giả: { book.author }</p>
                                                        <p className="bcate">Thể loại: { book.categories.join(', ') }</p>
                                                    </a>
                                                    <div className="button-ctn">
                                                        <button onClick={ () => {
                                                            let filename = book.filepath.split('/').pop().split('.').shift()
                                                            navigate(`/read/${book.title}_${book.book_id}_${filename}`)
                                                        } }>Đọc sách</button>
                                                        <button onClick={ () => {
                                                        fetch(`http://${host}:3055/v1/api/delete-book-from-storage?book_id=${book.book_id}`, {
                                                            method: 'delete',
                                                            credentials: 'include'
                                                        }).then(async (res) => {
                                                            console.log(res);
                                                            const messageText = await res.text()
                                                            const finalRes = JSON.parse(messageText)
                                                            if (finalRes.statusCode == 201) {
                                                                const newData = books.filter((bookN) => bookN.book_id !== book.book_id)
                                                                setBooks(newData);
                                                            }
                                                        })
                                                    } }>Xóa sách</button>
                                                    </div>
                                                    

                                                </div>






                                            </div>
                                        )
                                    })
                                }

                            </div>

                        </>

                    </>
                </InfiniteScroll> 
                {/* {isFirstLoad? <p>Đang tải</p>: (books.length? "" : <p>Không có sách</p>) } */}
                {hasBooks && (books.length ? <p className = "endtext">Hết</p> : <p className="endtext">Thêm sách để hiển thị</p>)}
                
            </div>
    

    )
    if (data != null) {

        return data.length ? (
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
                                            fetch(`http://${host}:3055/v1/api/delete-book-from-storage?book_id=${book.book_id}`, {
                                                method: 'delete',
                                                credentials: 'include'
                                            }).then(async (res) => {
                                                console.log(res);
                                                const messageText = await res.text()
                                                const finalRes = JSON.parse(messageText)
                                                if (finalRes.statusCode == 201) {
                                                    const newData = data.filter((bookN) => bookN.book_id !== book.book_id)
                                                    setData(newData);
                                                }
                                            })
                                        } }>Xóa</button>
                                        </td>
                                    </tr>
                                )
                            }) }
                        </tbody>

                    </table>

                </div>

            </>
        ) : (<div>
            <h2>Không có gì trong này</h2>
        </div>)

    }
}


export default function Storage() {
    // let refreshToken = document.cookie.refresh_Token
    // let rT = Cookies.get('refresh_token')
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        checkAuth(`http://${host}:3055/v1/api/`).then((res) => {
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

            navigate('/access')
        }
    }
}
