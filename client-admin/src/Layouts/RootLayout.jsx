import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import ChatComponent from './chat'
//import pre-load web page
import checkAuth from '../Auth/checkAuth'

//import css
import './RootLayout.css'
import { host } from '../host'
import SearchBar from './searchbar'
import AdvancedSearch from './advanceSearchBar'
import NotificationIcon from './NotificationIcon'
import ChatContainer from './chatContainer'
export default function RootLayout() {
    const location = useLocation()
    const isStoragePage = location.pathname === '/storage';
    const isInsertPage = location.pathname === '/manage-user';
    const isUpdatePage = location.pathname === '/update-book'
    const isReadPage = location.pathname.substring(0, 6) === '/read/'
    const isDetailPage = location.pathname.substring(0, 8) === '/detail/'
    const isAccessPage = location.pathname === '/access';
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(null)
    const [account, setAccount] = useState(null)
    const [openProfile, setOpenProfile] = useState(false)
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isChatVisible, setIsChatVisible] = useState(true)
    
    //tìm kiếm nâng cao
    const [showAdvancedSearch, setShowAdvancedSearch] = useState()
   



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
                <li>{ account.result.name } #{account.result.user_id} </li>
                    
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z" /></svg>
                        Hồ sơ</li>
                    <li><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z" /><path fill="currentColor" d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4" /></svg>
                        Cài đặt</li>
                    <li onClick={ handleLogout }><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M6 30h12a2 2 0 0 0 2-2v-3h-2v3H6V4h12v3h2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2" /><path fill="currentColor" d="M20.586 20.586L24.172 17H10v-2h14.172l-3.586-3.586L22 10l6 6l-6 6z" /></svg>
                        Đăng xuất</li>
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

    const handleRefresh = () => {
        setSearchPhrase('');
        setTotalPages('');
        setCreationDate('');
    };

    const validateTotalPages = (input) => {
        const pagesPattern = /^\d+-\d+$/;
        if (!pagesPattern.test(validateTot)) {
            setError('Định dạng tổng số trang không hợp lệ. Vui lòng nhập X-Y (ví dụ: 5-10).');
        } else {
            setTotalPages(input)
            setError('');
        }
    };

   

    const validateCreationDate = () => {
        const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}_\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
        if (!datePattern.test(creationDate)) {
            setError('Định dạng ngày tạo không hợp lệ. Vui lòng nhập (ngày tạo)T(giờ tạo)_(ngày tạo)T(giờ tạo) (ví dụ: 2020-01-01T00:00:00_2025-11-11T23:59:59).');
        } else {
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra định dạng tổng số trang
        validateTotalPages();
        // Kiểm tra định dạng ngày tạo tài liệu
        validateCreationDate();

        // Nếu không có lỗi, xử lý tìm kiếm
        if (!error) {
            console.log('Tìm kiếm với:', { searchPhrase, totalPages, creationDate });
        }
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const toggleChatVisibility = () => {
        setIsChatVisible(!isChatVisible);
    };

    return (

        <div>
            { !isAccessPage && <header className={ isReadPage ? "NavBar activebar" : 'NavBar' } >
                <NavLink to='/' className="logo">LibOnl</NavLink>

                <SearchBar />
                <div className="left-of-NavBar">


                    <button id="advance-icon" className={showAdvancedSearch ? 'active': ''} onClick={ handleAdvancedSearchToggle }><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"><path fill="currentColor" d="M5 5h2v3h10V5h2v5h2V5c0-1.1-.9-2-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v-2H5zm7-2c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1" /><path fill="currentColor" d="M20.3 18.9c.4-.7.7-1.5.7-2.4c0-2.5-2-4.5-4.5-4.5S12 14 12 16.5s2 4.5 4.5 4.5c.9 0 1.7-.3 2.4-.7l2.7 2.7l1.4-1.4zm-3.8.1c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5" /></svg></button>




                    { isLogin && <NavLink to='/manage-user' className={ isInsertPage ? 'active' : '' } id="storageicon"><svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#000" d="M2 18v-.8q0-.85.425-1.562T3.6 14.55q1.425-.725 2.963-1.15t3.137-.425q.35 0 .55.313t.075.662q-.15.525-.225 1.05t-.075 1.075q0 .725.15 1.4T10.6 18.8q.2.425-.037.813T9.9 20H4q-.825 0-1.412-.587T2 18m15 0q.825 0 1.413-.587T19 16t-.587-1.412T17 14t-1.412.588T15 16t.588 1.413T17 18m-7-6q-1.65 0-2.825-1.175T6 8t1.175-2.825T10 4t2.825 1.175T14 8t-1.175 2.825T10 12m5.85 8.2l-.15-.7q-.3-.125-.562-.262T14.6 18.9l-.725.225q-.325.1-.637-.025t-.488-.4l-.2-.35q-.175-.3-.125-.65t.325-.575l.55-.475q-.05-.35-.05-.65t.05-.65l-.55-.475q-.275-.225-.325-.563t.125-.637l.225-.375q.175-.275.475-.4t.625-.025l.725.225q.275-.2.538-.338t.562-.262l.15-.725q.075-.35.338-.562T16.8 11h.4q.35 0 .613.225t.337.575l.15.7q.3.125.562.275t.538.375l.675-.225q.35-.125.675 0t.5.425l.2.35q.175.3.125.65t-.325.575l-.55.475q.05.3.05.625t-.05.625l.55.475q.275.225.325.563t-.125.637l-.225.375q-.175.275-.475.4t-.625.025L19.4 18.9q-.275.2-.538.337t-.562.263l-.15.725q-.075.35-.337.563T17.2 21h-.4q-.35 0-.612-.225t-.338-.575"/></svg></NavLink> }
                    {/* { isLogin && <NavLink to='/Thongke' className={ isStoragePage ? 'active' : '' } id="storageicon"><svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4s8-1.79 8-4s-3.58-4-8-4M4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4m0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4" /></svg></NavLink> } */}
                    { isLogin && <NotificationIcon/>}
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

            { showAdvancedSearch && <AdvancedSearch setShowAdvancedSearch={setShowAdvancedSearch}/> }


            <main className={`${isReadPage ? "main_active" : 
                (isStoragePage ? "storage-p" : 
                (isDetailPage ? "detail-p" : 
                (isAccessPage ? "access-p" : 
                (isInsertPage ? "insert-p": ""))))} ${isChatOpen ? 'chat-active' : ''}`}>
                <Outlet />
            </main>

            {isLogin && !isReadPage && (
                <>
                    <button className={isChatVisible ? 'chat-toggle-btn' : 'chat-toggle-btn hiddenbtn'} onClick={toggleChatVisibility} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isChatVisible ? (
                                 <path d="M9 18l6-6-6-6"/>
                               
                            ) : (
                                <path d="M15 18l-6-6 6-6"/>
                            )}
                        </svg>
                    </button>
                    <div className={`chat-container ${isChatOpen ? 'active' : ''} ${isChatVisible ? 'visible' : 'hidden'}`}>
                        {account && <ChatContainer userId={account.result.user_id} isChatVisible={isChatVisible} />}
                    </div>
                </>
            )}
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