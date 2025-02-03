

import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'



//import pre-load web page
import checkAuth from '../Auth/checkAuth'

//import css
import './RootLayout.css'
import { host } from '../host'
import SearchBar from './searchbar'



export default function RootLayout() {
    const location = useLocation()
    const isStoragePage = location.pathname === '/storage';
    const isInsertPage = location.pathname === '/insert-book';
    const isUpdatePage = location.pathname === '/update-book'
    const isReadPage = location.pathname.substring(0, 6) === '/read/'
    const isDetailPage = location.pathname.substring(0, 8) === '/detail/'
    const isAccessPage = location.pathname === '/access';
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(null)
    const [account, setAccount] = useState(null)
    const [openProfile, setOpenProfile] = useState(false)
    const [isFirstLoad, setIsFirstLoad] = useState(true)

    //tìm kiếm nâng cao

    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false) // State cho form tìm kiếm nâng cao
    const [searchKeyword, setSearchKeyword] = useState('') // State cho từ khóa tìm kiếm


    const handleLogout = () => {

        fetch(`http://${host}:3055/v1/api/logout`, {
            credentials: 'include'
        }).then(async res => {
            const messageText = await res.text()
            const finalRes = JSON.parse(messageText)
            console.log('fetch thanh cong')
            if (finalRes.statusCode == 200) {

                window.location.reload()
            }

        })
    }






    const DropDownProfile = () => {
        return (
            <div className="drop-down-container " >
                <ul className="option-container">
                    <li>{ account.name }</li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z" /></svg>
                        Profile</li>
                    <li><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z" /><path fill="currentColor" d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4" /></svg>
                        Setting</li>
                    <li onClick={ handleLogout }><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M6 30h12a2 2 0 0 0 2-2v-3h-2v3H6V4h12v3h2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2" /><path fill="currentColor" d="M20.586 20.586L24.172 17H10v-2h14.172l-3.586-3.586L22 10l6 6l-6 6z" /></svg>
                        Logout</li>
                </ul>
            </div>
        )
    }



    useEffect(() => {


        checkAuth(`http://${host}:3055/v1/api/`)
            .then((res) => {
                setIsLogin(res)
                setIsFirstLoad(false)




                fetch(`http://${host}:3055/v1/api/get-info`, {
                    method: 'get',

                    credentials: 'include'
                }).then(async (res) => {
                    const messageText = await res.text()

                    const finalRes = JSON.parse(messageText)
                    setAccount(finalRes.metadata)

                })
            }).catch((error) => {
                console.error("Authentication check failed:", error);
            });
    }, [])


    const handleAdvancedSearchToggle = () => {
        setShowAdvancedSearch(!showAdvancedSearch);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Xử lý tìm kiếm với searchKeyword
        console.log('Tìm kiếm với từ khóa:', searchKeyword);
        // Đóng form sau khi tìm kiếm
        setShowAdvancedSearch(false);
        setSearchKeyword('');
    }

    const handleLogin = () => {
        navigate('/access')
    }
    return (

        <div>
            { !isAccessPage && <header className={ isReadPage ? "NavBar activebar" : 'NavBar' } >
                <NavLink to='/' className="logo">LibOnl</NavLink>

                <SearchBar />
                <div className="left-of-NavBar">


                    <button id="advance-icon" onClick={ handleAdvancedSearchToggle }><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path fill="currentColor" d="M5 5h2v3h10V5h2v5h2V5c0-1.1-.9-2-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v-2H5zm7-2c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1" /><path fill="currentColor" d="M20.3 18.9c.4-.7.7-1.5.7-2.4c0-2.5-2-4.5-4.5-4.5S12 14 12 16.5s2 4.5 4.5 4.5c.9 0 1.7-.3 2.4-.7l2.7 2.7l1.4-1.4zm-3.8.1c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5" /></svg></button>




                    { isLogin && <NavLink to='/insert-book' className={ isInsertPage ? 'active' : '' } id="storageicon"><svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M23 18h-3v-3h-2v3h-3v2h3v3h2v-3h3M6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v4.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" /></svg></NavLink> }
                    { isLogin && <NavLink to='/update-book' className={ isUpdatePage ? 'active' : '' } id="storageicon"><svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 2c-.53 0-1.04.21-1.41.59C4.21 2.96 4 3.47 4 4v16c0 .53.21 1.04.59 1.41c.37.38.88.59 1.41.59h7c-.37-.6-.66-1.28-.83-2H6V4h7v5h5v3h.5c.5 0 1 .06 1.5.17V8l-6-6zm6 16c.07-.7.24-1.38.5-2H8v2zm1.81-4c.62-.64 1.36-1.15 2.19-1.5V12H8v2zm4.19.5c1.11 0 2.11.45 2.83 1.17L22 14.5v4h-4l1.77-1.77A2.5 2.5 0 1 0 20 20h1.71A3.99 3.99 0 0 1 18 22.5c-2.21 0-4-1.79-4-4s1.79-4 4-4" /></svg></NavLink> }
                    { isLogin && <NavLink to='/storage' className={ isStoragePage ? 'active' : '' } id="storageicon"><svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4s8-1.79 8-4s-3.58-4-8-4M4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4m0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4" /></svg></NavLink> }
                    { isLogin && (<div className="profile-container" onClick={ () => {
                        setOpenProfile(!openProfile)
                    } }><img className="profile" src="https://th.bing.com/th/id/OIP.ROcugbff3Ni9CaUl7PnW-AHaHa?rs=1&pid=ImgDetMain" /></div>) }


                    { !isLogin ? (isFirstLoad ? "" :
                        <button onClick={ handleLogin } className="loginbutton">Đăng Nhập
                        </button>) : "" }
                    {/* {!isLogin && <button onClick={ handleLogin } className="loginbutton"><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M26 30H14a2 2 0 0 1-2-2v-3h2v3h12V4H14v3h-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2" /><path fill="currentColor" d="M14.59 20.59L18.17 17H4v-2h14.17l-3.58-3.59L16 10l6 6l-6 6z" /></svg></button>} */ }



                </div>


                { openProfile && <DropDownProfile /> }
            </header> }

            { showAdvancedSearch && (
                <div className="overlay">

                    <div className="advance-search-form">
                        <div className="Nav-TB">
                            <h2>Tìm kiếm nâng cao</h2>
                            <button onClick={ (event) => { setShowAdvancedSearch(false) } }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg></button>
                        </div>

                        <p>Chức năng này sẽ giúp bạn tìm kiếm một cụm từ hoặc một đoạn văn từ nội dung của tất cả các văn bản</p>
                        <p>Lưu ý: từ khóa tìm kiếm <i style={ { color: "red" } }><b>không</b></i> bao gồm tiêu đề hoặc tên tác giả! </p>
                        <div className="advance-search-input" style={ { display: 'flex' } }>
                            <div style={ { flex: 0.5, paddingRight: '10px' } }>
                                <label>
                                    Nhập cụm từ:
                                    <textarea name="message" rows="4" cols="50" placeholder="Nhập đoạn văn tại đây..." style={ { width: '100%' } }></textarea>
                                </label>
                            </div>

                            <div style={ { flex: 0.4, paddingLeft: '10px' } }>
                                <label>
                                    Lọc tổng số trang:
                                    <input type="text" placeholder="Nhập số trang..." style={ { width: '100%', maxWidth: '400px', marginBottom: "18px" } } />
                                </label>

                                <label>
                                    Lọc ngày tạo tài liệu:
                                    <input type="text" placeholder="Nhập ngày tạo (VD: YYYY-MM-DD)..." style={ { width: '100%', maxWidth: '317px' } } />
                                </label>
                            </div>

                            <div style={ { flex: 0.1, display: 'flex', flexDirection: 'column', justifyContent: 'center' } }>
                                <button id="search-refresh-btn" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V5q0-.425.288-.712T19 4t.713.288T20 5v5q0 .425-.288.713T19 11h-5q-.425 0-.712-.288T13 10t.288-.712T14 9h3.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.7 0 3.113-.862t2.187-2.313q.2-.35.563-.487t.737-.013q.4.125.575.525t-.025.75q-1.025 2-2.925 3.2T12 20"/></svg></button>
                                <button id="search-advance-btn" type="submit"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="24x" height="24px"><path d="M 22.205078 2 C 21.715078 2 21.29775 2.3558438 21.21875 2.8398438 L 20.263672 8.6933594 C 19.063672 9.0383594 17.911172 9.5114688 16.826172 10.105469 L 11.996094 6.6542969 C 11.597094 6.3692969 11.054031 6.4167188 10.707031 6.7617188 L 6.8203125 10.648438 C 6.4773125 10.991437 6.4280312 11.530734 6.7070312 11.927734 L 10.107422 16.791016 C 9.5024219 17.886016 9.0209219 19.045953 8.6699219 20.251953 L 2.8378906 21.222656 C 2.3558906 21.302656 2.0019531 21.719031 2.0019531 22.207031 L 2.0019531 27.707031 C 2.0019531 28.192031 2.3491719 28.608359 2.8261719 28.693359 L 8.6582031 29.726562 C 9.0072031 30.929562 9.4887031 32.0895 10.095703 33.1875 L 6.6542969 38 C 6.3702969 38.397 6.4167188 38.942063 6.7617188 39.289062 L 10.648438 43.179688 C 10.991437 43.522688 11.532688 43.571969 11.929688 43.292969 L 16.800781 39.880859 C 17.893781 40.481859 19.047141 40.958687 20.244141 41.304688 L 21.220703 47.166016 C 21.299703 47.647016 21.716078 48 22.205078 48 L 27.705078 48 C 28.190078 48 28.605453 47.652781 28.689453 47.175781 L 29.007812 45.386719 C 25.420813 43.311719 23 39.442 23 35 C 23 33.897 23.160453 32.833359 23.439453 31.818359 C 20.325453 31.108359 18 28.329 18 25 C 18 21.134 21.134 18 25 18 C 28.329 18 31.108359 20.325453 31.818359 23.439453 C 32.833359 23.160453 33.897 23 35 23 C 39.442 23 43.310766 25.418859 45.384766 29.005859 L 47.171875 28.693359 C 47.650875 28.609359 47.998047 28.192031 47.998047 27.707031 L 47.998047 22.207031 C 47.999047 21.717031 47.644156 21.299703 47.160156 21.220703 L 41.25 20.255859 C 40.904 19.069859 40.431844 17.928609 39.839844 16.849609 L 43.289062 11.933594 C 43.568063 11.536594 43.520734 10.994391 43.177734 10.650391 L 39.287109 6.7636719 C 38.940109 6.4176719 38.394094 6.3731563 37.996094 6.6601562 L 33.154297 10.140625 C 32.065297 9.538625 30.915656 9.0618437 29.722656 8.7148438 L 28.691406 2.828125 C 28.607406 2.350125 28.191078 2 27.705078 2 L 22.205078 2 z M 35 25 C 29.488997 25 25 29.488997 25 35 C 25 40.511003 29.488997 45 35 45 C 37.396508 45 39.597385 44.148986 41.322266 42.736328 L 47.292969 48.707031 L 48.707031 47.292969 L 42.736328 41.322266 C 44.148986 39.597385 45 37.396508 45 35 C 45 29.488997 40.511003 25 35 25 z M 35 27 C 39.430123 27 43 30.569877 43 35 C 43 39.430123 39.430123 43 35 43 C 30.569877 43 27 39.430123 27 35 C 27 30.569877 30.569877 27 35 27 z"/></svg></button>
                            </div>
                        </div>
                    </div>
                </div>
            ) }


            <main className={ isReadPage ? "main_active" : (isStoragePage ? "storage-p" : (isDetailPage ? "detail-p" : (isAccessPage ? "access-p" : ""))) }>
                <Outlet />
            </main>
        </div>
    )

    // if (isValid == null) {
    //     return <p className="load">Loading...</p>
    // } else {
    //     if (isValid) {
    //         return (
    //             <div>
    //                 <header className='NavBar'>
    //                     <NavLink to='/'>Home</NavLink>
    //                     <NavLink to='/storage'>Storage</NavLink>
    //                     <button onClick={ handleLogout }>Logout</button>

    //                 </header>
    //                 <main>
    //                     <Outlet />
    //                 </main>
    //             </div>
    //         )

    //     } else {
    //         return (
    //             <>
    //                 <Login />
    //                 <Register />
    //             </>
    //         )
    //     }
    // }



}