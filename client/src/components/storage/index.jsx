import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { Form, Link, NavLink, Outlet, useActionData, useNavigate } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'
import InfiniteScroll from 'react-infinite-scroll-component'
import ReactPaginate from 'react-paginate'


// const useCookieState(){

// }




function Items() {
    const [valid, setValid] = useState(false)
    const [books, setBooks] = useState([]);   // Quản lý trạng thái còn dữ liệu để tải
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchBooks = async () => {

       

        fetch(`http://localhost:3055/v1/api/get-books-from-storage?page=${page}`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
            const messageText = await res.text()

            const finalRes = JSON.parse(messageText)
            const data = finalRes.metadata
            if(data.length == 0){
                setHasMore(false)
            }else{
                setBooks([...books, ...data])
                console.log(books);
            }
        }).catch(err => {
            console.log(err);
        })
    }
  
    useEffect(() => {
        fetchBooks();
    }, [page])

    const fetchMoreData = () => {
        setPage(page+1); // Tăng số trang lên để tải dữ liệu mới
      };
    
    
    return (
        <InfiniteScroll
            dataLength={books.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4></h4>}
            endMessage={<p></p>}
        >

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
                            { books.map((book) => {
                                console.log(books);
                                return (
                                    <tr key={ book.book_id }>
                                        
                                        <td><a href={`/detail/${book.title}_${book.book_id}`}>
                                        <img src={ book.thumbnail } alt="" width="200" height="200" />
                                        </a>
                                        </td>
                                        <td><a href={`/detail/${book.title}_${book.book_id}`}>
                                        <p>{ book.title }</p>
                                        </a>
                                        </td>
                                        <td><p>{ book.author }</p></td>
                                        <td><p>{ book.description }</p></td>
                                        <td><button onClick={ () => {
                                            fetch(`http://localhost:3055/v1/api/delete-book-from-storage?book_id=${book.book_id}`, {
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
                                        } }>Xóa</button>
                                        </td>
                                    </tr>
                                )
                            }) }
                        </tbody>

                    </table>

                </div>

            </> 
        </InfiniteScroll>
    )
    if (data != null) {

        return data.length? (
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
                                            fetch(`http://localhost:3055/v1/api/delete-book-from-storage?book_id=${book.book_id}`, {
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
        checkAuth('http://localhost:3055/v1/api/').then((res) => {
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
