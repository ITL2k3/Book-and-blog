

import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'



//import pre-load web page
import checkAuth from '../Auth/checkAuth'

//import css
import './RootLayout.css'



export default function RootLayout() {
    const location = useLocation()
    const isStoragePage = location.pathname === '/storage';
    const isReadPage = location.pathname.substring(0, 6) === '/read/'
    const isDetailPage = location.pathname.substring(0, 8) === '/detail/'
    const isAccessPage = location.pathname === '/access';
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(null)
    const [account, setAccount] = useState(null)
    const [openProfile, setOpenProfile] = useState(false)



    const [isFirstLoad, setIsFirstLoad] = useState(true)

    const handleLogout = () => {
        
        fetch('http://localhost:3055/v1/api/logout', {
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
       
        
        checkAuth('http://localhost:3055/v1/api/')
            .then((res) => {
                setIsLogin(res)
                setIsFirstLoad(false)




                fetch('http://localhost:3055/v1/api/get-info', {
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


   

    const handleLogin = () => {
        navigate('/access')
    }
    return (

        <div>
            { !isAccessPage && <header className={ isReadPage ? "NavBar activebar" : 'NavBar' } >
                <NavLink to='/' className="logo">LibOnl</NavLink>
                <div className="left-of-NavBar">
                    { isLogin && <NavLink to='/storage' className={ isStoragePage ? 'active' : '' } id="storageicon"><svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="currentColor" d="m25.707 17.293l-5-5A1 1 0 0 0 20 12h-6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V18a1 1 0 0 0-.293-.707M23.586 18H20v-3.586ZM14 28V14h4v4a2 2 0 0 0 2 2h4v8Z" /><path fill="currentColor" d="M8 27H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.586A2 2 0 0 1 13 3.586L16.414 7H28a2 2 0 0 1 2 2v8h-2V9H15.586l-4-4H4v20h4Z" /></svg></NavLink> }
                    { isLogin && (<div className="profile-container" onClick={ () => {
                        setOpenProfile(!openProfile)
                    } }><img className="profile" src="https://th.bing.com/th/id/OIP.ROcugbff3Ni9CaUl7PnW-AHaHa?rs=1&pid=ImgDetMain" /></div>) }


                    {!isLogin ? (isFirstLoad ? "" : 
                    <button onClick={ handleLogin } className="loginbutton">Đăng Nhập
                    </button> ) : "" }
                    {/* {!isLogin && <button onClick={ handleLogin } className="loginbutton"><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M26 30H14a2 2 0 0 1-2-2v-3h2v3h12V4H14v3h-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2" /><path fill="currentColor" d="M14.59 20.59L18.17 17H4v-2h14.17l-3.58-3.59L16 10l6 6l-6 6z" /></svg></button>} */}
    


                </div>


                { openProfile && <DropDownProfile /> }
            </header> }
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