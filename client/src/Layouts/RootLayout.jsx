
import Login from '../components/Login/Login'
import Register from '../components/Login/Register'

import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'



//import pre-load web page
import checkAuth from '../Auth/checkAuth'

//import css
import './RootLayout.css'

export default function RootLayout() {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(null)
    useEffect(() => {
        checkAuth('http://localhost:3055/v1/api/')
        .then((res) => {
            setIsLogin(res)
        }).catch((error) => {
            console.error("Authentication check failed:", error);
        });
    }, [])

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
    const handleLogin = () => {
        navigate('/access')
    }
    return (
        <div>
            <header className='NavBar'>
                <NavLink to='/'>Home</NavLink>
                {isLogin && <NavLink to='/storage'>Storage</NavLink>}
                

                {isLogin? (<button onClick={handleLogout}>Logout</button>) : (<button onClick={handleLogin}>Login</button>)}

            </header>
            <main>
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