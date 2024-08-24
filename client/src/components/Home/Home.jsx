import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'
import ReactPaginate from 'react-paginate'


import './Home.css'
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
        fetch(`http://localhost:3055/v1/api/Library/search?page=${page}`, {
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
        fetch(`http://localhost:3055/v1/api/Library/search?page=${event.selected + 1}`, {
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








    if (data != null) {
        return (
            <>
                <div className="library-container">
                { data.map((book) => {
                    
                    return (
                        <div className = 'bookitem'>
                            <a href={`/detail/${book.title}_${book.book_id}`}>
                          
                            <img src={ book.thumbnail } alt="" width = "200" height = "200" />
                            <p>Tiêu đề: { book.title }</p>
                            <p>Tác giả: { book.author }</p>
                            </a>
                           

                        </div>
                    )

                }) }
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
            </>
        )

    }
}


export default function Home() {
    // let refreshToken = document.cookie.refresh_Token
    // let rT = Cookies.get('refresh_token')
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)



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
            // return <p>Loading...</p>
            return <Login />
        }
    }
}
