import Login from '../Login/Login';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import checkAuth from '../../Auth/checkAuth';
import ReactPaginate from 'react-paginate';
import InfiniteScroll from 'react-infinite-scroll-component'
import './Home.css';
import { host } from '../../host';

function Items() {
    const [data, setData] = useState(["default"]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [booksLength, setBooksLength] = useState(null);
    const [itemsPerPage] = useState(15);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSortDropdown, setSortShowDropdown] = useState(false);
    const [showViewDropdown, setViewShowDropdown] = useState(true);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(1)
    const [trans, setTrans] = useState(1)
    const [queryString, setQueryString] = useState('');








    //data for views
    const [hasMore, setHasMore] = useState(true);


    const fetchDataList = async () => {


        fetch(`http://${host}:3055/v1/api/Library/search?page=${page}&option=Home&${queryString}`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
            const messageText = await res.text()

            const finalRes = JSON.parse(messageText)
            const books = finalRes.metadata.results
            console.log('page: ', page);
            console.log(data)
            console.log(books);
            console.log('book.length', books.length);
            if (books.length == 0) {
                if (page == 1) {
                    setData([])
                }
                console.log('book.length == 0', data);

                setHasMore(false)
                setHasMore(true);
            } else {
                if (page == 1) {
                    console.log('this page1');
                    if (books.length == 0) {
                        setData([])
                    } else {
                        console.log('books ', books);
                        console.log('setted');
                        setData([])
                        setData(books)
                        console.log('dat:', data);
                    }

                } else {
                    console.log('o o');
                    setData([...data, ...books])
                }

            }
            console.log('after', data)
        }).catch(err => {
            console.log(err);
        })


    }



    const fetchDataGrid = async () => {
        try {
            const res = await fetch(`http://${host}:3055/v1/api/Library/search?page=${page}&option=Home&${queryString}`, {
                method: 'get',
                credentials: 'include'
            });
            const messageText = await res.text();
            const finalRes = JSON.parse(messageText);
            if (!finalRes.metadata.results) {
                setData(null)
                setBooksLength(null);
            }
            if (finalRes.metadata.sumOfBooks) {
                setBooksLength(finalRes.metadata.sumOfBooks);
            } else {
                setBooksLength(null);
            }
            setData(finalRes.metadata.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchMoreData = () => {
        setPage(page + 1)
    }



    useEffect(() => {

        if (view == 1) {
            fetchDataGrid();
        } else {
            console.log('put');
            fetchDataList();
        }

    }, [page, queryString]); // Trigger useEffect when page or queryString changes

    useEffect(() => {
        setPageCount(Math.ceil(booksLength / itemsPerPage));
    }, [data, booksLength]);

    const handlePageClick = (event) => {
        window.scrollTo(0, 0)
        setPage(event.selected + 1);
    };

    const handleSubmit = (event) => {

        window.scrollTo({ top: 0, behavior: 'instant' })
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form nếu cần



        const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedCategories = Array.from(checkedBoxes).map((checkbox) => checkbox.value);
        const newQueryString = selectedCategories.map((category) => `category=${category}`).join('&');




        setQueryString(newQueryString); // Cập nhật queryString




        const checkedRadio = document.querySelectorAll('input[type="radio"]:checked');
        if (checkedRadio[0].value == 'list') {

            setPage(1)
            // setTrans(!trans)
            fetchDataList()

            setView(0)
        } else {

            setPage(1)
            // setTrans(!trans)
            fetchDataGrid()
            setView(1)
        }





        // setHasMore(true)


    };


    const handleFilterClick = () => {
        setShowDropdown(!showDropdown);
    };
    const handleSortClick = () => {
        setSortShowDropdown(!showSortDropdown)
    }
    const handleViewClick = () => {
        setViewShowDropdown(!showViewDropdown)
    }

    if (data != null) {
        return (
            <>
                <div className="home">
                    <div id="top"></div>
                    <div className="left-tool-bar">
                        <div id="filterbutton" className={ showDropdown ? 'active' : '' } onClick={ handleFilterClick }>

                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 32 32"><path fill="currentColor" d="M18 28h-4a2 2 0 0 1-2-2v-7.59L4.59 11A2 2 0 0 1 4 9.59V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3.59a2 2 0 0 1-.59 1.41L20 18.41V26a2 2 0 0 1-2 2M6 6v3.59l8 8V26h4v-8.41l8-8V6Z" /></svg>
                            <span>Bộ lọc</span>

                            { showDropdown ? <svg xmlns="http://www.w3.org/2000/svg" className='right-icon' width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="right-icon" width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="currentColor" d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z" /></svg> }

                        </div>
                        { showDropdown && (
                            <div className="dropdown">

                                <input type='checkbox' name='categories01' value='kns' id='category01' />
                                <label htmlFor='category01'>Kỹ năng sống</label> <br />
                                <input type='checkbox' name='categories02' value='kt' id='category02' />
                                <label htmlFor='category02'>Kinh tế</label> <br />
                                <input type='checkbox' name='categories03' value='tc' id='category03' />
                                <label htmlFor='category03'>Tài chính</label> <br />
                                <input type='checkbox' name='categories04' value='cn' id='category04' />
                                <label htmlFor='category04'>Công nghệ</label> <br />
                                <input type='checkbox' name='categories05' value='nn' id='category05' />
                                <label htmlFor='category05'>Ngoại ngữ</label> <br />
                                <input type='checkbox' name='categories06' value='dc' id='category06' />
                                <label htmlFor='category06'>Đề cương</label> <br />
                                <input type='checkbox' name='categories07' value='gt' id='category07' />
                                <label htmlFor='category07'>Giáo trình</label> <br />


                            </div>
                        ) }
                        <div id="filterbutton" className={ showSortDropdown ? 'active' : '' } onClick={ handleSortClick }>

                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 32 32"><path fill="currentColor" d="m16 28l-7-7l1.41-1.41L16 25.17l5.59-5.58L23 21zm0-24l7 7l-1.41 1.41L16 6.83l-5.59 5.58L9 11z" /></svg>                      <span>Sắp xếp</span>

                            { showSortDropdown ? <svg xmlns="http://www.w3.org/2000/svg" className='right-icon' width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="right-icon" width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="currentColor" d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z" /></svg> }

                        </div>
                        { showSortDropdown && (
                            <div className="dropdown">
                                <form onSubmit={ handleSubmit }>
                                    <input type='radio' name='sort' value='title' id='sort01' />
                                    <label htmlFor='sort01'>Theo tiêu đề</label> <br />
                                    <input type='radio' name='sort' value='author' id='sort02' />
                                    <label htmlFor='sort02'>Theo tác giả</label> <br />


                                </form>
                            </div>
                        ) }

                        <div id="filterbutton" className={ showViewDropdown ? 'active' : '' } onClick={ handleViewClick }>

                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 32 32"><circle cx="16" cy="19" r="2" fill="currentColor" /><path fill="currentColor" d="M23.777 18.479A8.64 8.64 0 0 0 16 13a8.64 8.64 0 0 0-7.777 5.479L8 19l.223.522A8.64 8.64 0 0 0 16 25a8.64 8.64 0 0 0 7.777-5.478L24 19ZM16 23a4 4 0 1 1 4-4a4.005 4.005 0 0 1-4 4" /><path fill="currentColor" d="M27 3H5a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M5 5h22v4H5Zm0 22V11h22v16Z" /></svg><span>Khung nhìn</span>

                            { showViewDropdown ? <svg xmlns="http://www.w3.org/2000/svg" className='right-icon' width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="right-icon" width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="currentColor" d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z" /></svg> }

                        </div>
                        { showViewDropdown && (
                            <div className="dropdown">

                                {/* <form onSubmit={handleViewSubmit}> */ }
                                <input type='radio' name='view' defaultChecked value='grid' id='view01' />
                                <label htmlFor='view01'><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32"><path fill="currentColor" d="M12 4H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 8H6V6h6zm14-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 8h-6V6h6zm-14 6H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2m0 8H6v-6h6zm14-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2m0 8h-6v-6h6z" /></svg></label> <br />
                                <input type='radio' name='view' disabled value='list' id='view02' />
                                <label htmlFor='view02'><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32"><path fill="currentColor" d="M10 6h18v2H10zm0 18h18v2H10zm0-9h18v2H10zm-6 0h2v2H4zm0-9h2v2H4zm0 18h2v2H4z" /></svg></label> <br />


                                {/* </form> */ }
                            </div>

                        ) }
                        <button className="submitB" onClick={ handleSubmit }>submit</button>
                    </div>
                    {/* {loading && <div className ="overlayCT">Loading...</div> } */ }
                    <div className="content">

                        {

                            view ? (data.length ?
                                <div className="library-container">
                                    {
                                        data.map((book) => (

                                            <a key={ book.book_id } href={ `/detail/${book.title}_${book.book_id}` }>
                                                <div className='bookitem' key={ book.book_id }>
                                                    <div className="book-cover">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z" /><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z" /><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z" /><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z" /><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892" /><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035" /><path fill="#909090" d="M23.954 2.077V7.95h5.633z" /><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z" /><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892" /></svg>

                                                    </div>

                                                    <div className="book-info">
                                                        <h3> { book.title }</h3>
                                                        <p> { book.author }</p>
                                                    </div>
                                                </div>


                                            </a>

                                        )) }
                                </div> : (booksLength ? <p className="alerttext">Chọn 1 trang để hiển thị</p> : <p className="alerttext">không có sách nào để hiển thị</p>)
                            ) : <div>
                                <InfiniteScroll
                                    dataLength={ data.length }
                                    next={ fetchMoreData }
                                    hasMore={ hasMore }
                                    loader={ <h4></h4> }
                                    endMessage={ <p>Hết</p> }
                                >

                                    <>
                                        <div className="library-view-container">
                                            {
                                                data.map((book) => {
                                                    return (
                                                        <div className="View-bookitem" key={ book.book_id }>
                                                            <img src={ book.thumbnail } alt="" />
                                                            <a key={ book.book_id } href={ `/detail/${book.title}_${book.book_id}` }>
                                                                <div className="btext">
                                                                    <p>{ book.title }</p>
                                                                    <p>{ book.author }</p>
                                                                    <p>{ book.categories }</p>
                                                                </div></a>





                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>

                                    </>
                                </InfiniteScroll>
                            </div>
                        }


                        {/* {
                    data.length? (view ? 
                        <div className="library-container">
                        {
                        data.map((book) => (
                            
                                <a key = {book.book_id} href={`/detail/${book.title}_${book.book_id}`}>
                                    <div className='bookitem' key={book.book_id}>
                                        <div className ="book-cover">
                                            <img src={book.thumbnail} alt=""  />
                                        </div>
                                    
                                        <div className="book-info">
                                            <h3> {book.title}</h3>
                                            <p> {book.author}</p>
                                        </div>
                                    </div>
                                    
                                    
                                </a>
                           
                        ))}
                        
                           
                        </div> 
                        :
                        <div>
                        <InfiniteScroll
                        dataLength={ data.length }
                        next={ fetchMoreData }
                        hasMore={ hasMore }
                        loader={ <h4></h4> }
                        endMessage={ <p>Hết</p> }
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
                                    { data.map((book) => {
                                      
                                        return (
                                            <tr key={ book.book_id }>

                                                <td><a href={ `/detail/${book.title}_${book.book_id}` }>
                                                    <img src={ book.thumbnail } alt="" width="200" height="200" />
                                                </a>
                                                </td>
                                                <td><a href={ `/detail/${book.title}_${book.book_id}` }>
                                                    <p>{ book.title }</p>
                                                </a>
                                                </td>
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
                    </div>
                    
                ) : (booksLength? <p className="alert text">Chọn 1 trang để hiển thị</p> : <p className="alerttext">Không có sách nào</p>) 
                */}

                        { view ? <div className="pagination-container">
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
                        </div> : '' }


                    </div>



                </div>

            </>
        );
    }
}

export default function Home() {

    return <Items />

}



