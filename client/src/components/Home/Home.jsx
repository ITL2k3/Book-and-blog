import Login from '../Login/Login';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import checkAuth from '../../Auth/checkAuth';
import ReactPaginate from 'react-paginate';

import './Home.css';

function Items() {
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [booksLength, setBooksLength] = useState(null);
    const [itemsPerPage] = useState(5);
    const [showDropdown, setShowDropdown] = useState(false);
    const [queryString, setQueryString] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:3055/v1/api/Library/search?page=${page}&option=Home&${queryString}`, {
                    method: 'get',
                    credentials: 'include'
                });
                const messageText = await res.text();
                const finalRes = JSON.parse(messageText);
                if(!finalRes.metadata.results){
                    setData(null)
                    setBooksLength(null);
                }
                if(finalRes.metadata.sumOfBooks){
                    setBooksLength(finalRes.metadata.sumOfBooks);
                }else{
                    setBooksLength(null);
                }
                setData(finalRes.metadata.results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [page, queryString]); // Trigger useEffect when page or queryString changes

    useEffect(() => {
        setPageCount(Math.ceil(booksLength / itemsPerPage));
    }, [data, booksLength]);

    const handlePageClick = (event) => {
        setPage(event.selected + 1);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form nếu cần
        const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedCategories = Array.from(checkedBoxes).map((checkbox) => checkbox.value);
        const newQueryString = selectedCategories.map((category) => `category=${category}`).join('&');

        setQueryString(newQueryString); // Cập nhật queryString
    };

    const handleFilterClick = () => {
        setShowDropdown(!showDropdown);
    };

    if (data != null) {
        return (
            <>
                <button id="filterButton" onClick={handleFilterClick}>Filter</button>
                {showDropdown && (
                    <div className="dropdown">
                        <form onSubmit={handleSubmit}>
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
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )}
                
                {
                    data.length? (<div className="library-container">
                        {
                        data.map((book) => (
                            <div className='bookitem' key={book.book_id}>
                                <a href={`/detail/${book.title}_${book.book_id}`}>
                                    <img src={book.thumbnail} alt="" width="200" height="200" />
                                    <p>Tiêu đề: {book.title}</p>
                                    <p>Tác giả: {book.author}</p>
                                </a>
                            </div>
                        ))}
                    </div>) : (booksLength? <p>Chọn 1 trang để hiển thị</p> : <p>Không có sách nào</p>) 
                }
                
               
                
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
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
                    renderOnZeroPageCount={null}
                />
                
            </>
        );
    }
}

export default function Home() {

    return <Items/>
    // const [isValid, setValid] = useState(null);

    // useEffect(() => {
    //     checkAuth('http://localhost:3055/v1/api/').then((res) => {
    //         if (res === false) {
    //             setValid(false);
    //         } else {
    //             setValid(true);
    //         }
    //     });
    // }, []);

    // if (isValid === null) {
    //     return <p>Loading...</p>;
    // } else {
    //     if (isValid) {
    //         return <Items />;
    //     } else {
    //         return <Login />;
    //     }
    // }
}


// import Login from '../Login/Login'
// import { useEffect, useRef, useState } from 'react'
// import { NavLink, Outlet } from 'react-router-dom'
// import checkAuth from '../../Auth/checkAuth'
// import ReactPaginate from 'react-paginate'


// import './Home.css'


// function Items() {
//     const [data, setData] = useState(null)
//     const [page, setPage] = useState(1)


    
//     const [currentItems, setCurrentItems] = useState(null);
//     const [pageCount, setPageCount] = useState(0);

//     const [booksLength, setbooksLength] = useState(null)
//     let itemsPerPage = 5;

//     //filter
//     const [showDropdown, setShowDropdown] = useState(false);
   
//     const [queryString, setQueryString] = useState([])
//     useEffect(() => {
//         fetch(`http://localhost:3055/v1/api/Library/search?page=${page}&option=Home&${queryString}`, {
//             method: 'get',
//             credentials: 'include'
//         }).then(async (res) => {
//             console.log(res);
//             const messageText = await res.text()
            
//             const finalRes = JSON.parse(messageText)
//             setbooksLength(finalRes.metadata.sumOfBooks)
//             setData(finalRes.metadata.results)
//         })
//     }, [])


    
//     useEffect(() => {
//         // Fetch items from another resources.
//         // setCurrentItems(data);
//         setPageCount(Math.ceil(booksLength / itemsPerPage));
//     }, [data]);

//     // Invoke when user click to request another page.
//     const handlePageClick = (event) => {
//         fetch(`http://localhost:3055/v1/api/Library/search?page=${event.selected + 1}&option=Home&${queryString}`, {
//             method: 'get',
//             credentials: 'include'
//         }).then(async (res) => {
//             console.log(res);
//             const messageText = await res.text()
            
//             const finalRes = JSON.parse(messageText)
//             setData(finalRes.metadata.results)
//         })
      
//     };


//     const handleSubmit = (event) => {
//         const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        
//         // Tạo một mảng chứa các giá trị của các checkbox đã được chọn
//         const selectedCategories = Array.from(checkedBoxes).map((checkbox) => checkbox.value);
//         const newQueryString = selectedCategories.map((category) => `category=${category}`).join('&');

//         setQueryString(newQueryString);
       
//         console.log('qstr:', queryString);
//         // Log các giá trị của checkbox đã được chọn ra console
//         fetch(`http://localhost:3055/v1/api/Library/search?page=${page}&option=Home&${queryString}`, {
//             method: 'get',
//             credentials: 'include'
//         }).then(async (res) => {
//             console.log(res);
//             const messageText = await res.text()
            
//             const finalRes = JSON.parse(messageText)
//             if(finalRes.metadata.sumOfBooks){
//                 setbooksLength(finalRes.metadata.sumOfBooks)
//             }
            
//             setData(finalRes.metadata.results)
//             console.log(data);
//         })
//     }



//     const handleFilterClick = (event) => {
//         setShowDropdown(!showDropdown);
//     }


//     if (data != null) {
//         return (
//             <>
//                 <button id="filterButton" onClick={handleFilterClick}>Filter</button>
//                 {showDropdown && (
//                 <div className="dropdown">
//                     <form>
//                     <input type='checkbox' name='categories01' value = 'kns' id= 'category01' />
//                             <label for='category01'>Kỹ năng sống</label> <br />
//                             <input type='checkbox' name='categories02' value = 'kt' id= 'category02' />
//                             <label for='category02'>Kinh tế</label> <br />
//                             <input type='checkbox' name='categories03' value = 'tc' id= 'category03' />
//                             <label for='category03'>Tài chính</label> <br />
//                             <input type='checkbox' name='categories04' value = 'cn' id= 'category04' />
//                             <label for='category04'>Công nghệ</label> <br />
//                             <input type='checkbox' name='categories05' value = 'nn' id= 'category05' />
//                             <label for='category05'>Ngoại ngữ</label> <br />
//                             <input type='checkbox' name='categories06' value = 'dc' id= 'category06' />
//                             <label for='category06'>Đề cương</label> <br />
//                             <input type='checkbox' name='categories07' value = 'gt' id= 'category07' />
//                             <label for='category07'>Giáo trình</label> <br />
//                         <button type="button" onClick={handleSubmit}>
//                             Submit
//                         </button>
//                     </form>
//                 </div>
//             )}


//                 <div className="library-container">
//                 { data.map((book) => {
                    
//                     return (
//                         <div className = 'bookitem'>
//                             <a href={`/detail/${book.title}_${book.book_id}`}>

//                             <img src={ book.thumbnail } alt="" width = "200" height = "200" />
//                             <p>Tiêu đề: { book.title }</p>
//                             <p>Tác giả: { book.author }</p>
//                             </a>
                           

//                         </div>
//                     )

//                 }) }
//                 </div>
                
//                 <ReactPaginate
//                         nextLabel="next >"
//                         onPageChange={ handlePageClick }
//                         pageRangeDisplayed={ 3 }
//                         marginPagesDisplayed={ 2 }
//                         pageCount={ pageCount }
//                         previousLabel="< previous"
//                         pageClassName="page-item"
//                         pageLinkClassName="page-link"
//                         previousClassName="page-item"
//                         previousLinkClassName="page-link"
//                         nextClassName="page-item"
//                         nextLinkClassName="page-link"
//                         breakLabel="..."
//                         breakClassName="page-item"
//                         breakLinkClassName="page-link"
//                         containerClassName="pagination"
//                         activeClassName="active"
//                         renderOnZeroPageCount={ null }
//                     />
//             </>
//         )

//     }
// }


// export default function Home() {
//     // let refreshToken = document.cookie.refresh_Token
//     // let rT = Cookies.get('refresh_token')
//     const [isValid, setValid] = useState(null)
//     const [data, setData] = useState(null)



//     useEffect(() => {
        
//             checkAuth('http://localhost:3055/v1/api/').then((res) => {
//                 if (res == false) {
//                     setValid(false)
//                 } else {
//                     setValid(true)
//                     setData(res)
//                 }
//             })
        
        
//     }, [])






//     if (isValid == null) {
//         <p>Loading...</p>

//     } else {
//         if (isValid) {



//             return (
//                 <>
//                     <Items />
                    
//                 </>
//             )


//         } else {
//             // return <p>Loading...</p>
//             return <Login />
//         }
//     }
// }
