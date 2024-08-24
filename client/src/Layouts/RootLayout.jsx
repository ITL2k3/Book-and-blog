
import Login from '../components/Login/Login'
import Register from '../components/Login/Register'

import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'



//import pre-load web page
import checkAuth from '../Auth/checkAuth'

//import css
import './RootLayout.css'

export default function RootLayout() {

    const [isValid, setValid] = useState(null)
    useEffect(() => {
        checkAuth('http://localhost:3055/v1/api/').then((res) => {
            setValid(res)
        })
    }, [])
    if (isValid == null) {
        return <p className="load">Loading...</p>
    } else {
        if (isValid) {
            return (
                <div>
                    <header className='NavBar'>
                        <NavLink to='/'>Home</NavLink>
                        <NavLink to='/about'>About</NavLink>
                        <NavLink to='/insert-book'>Insert Book</NavLink>
                        <NavLink to='/help'>Help</NavLink>

                    </header>
                    <main>
                        <Outlet />
                    </main>
                </div>
            )

        } else {
            return (
                <>
                    <Login />
                    <Register />
                </>
            )
        }
    }



}