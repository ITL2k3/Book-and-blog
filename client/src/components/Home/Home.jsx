import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'


// const useCookieState(){

// }


export default function Home() {
    // let refreshToken = document.cookie.refresh_Token
    // let rT = Cookies.get('refresh_token')
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    useEffect(() => {
        
        checkAuth('http://localhost:3055/v1/api/getUser').then((res) => {
            if(res == false){
                setValid(false)
            }else{
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
                <div className = "home">
                    <h2>Welcome</h2>
                    <p>
                        Loremipsome
                    </p>
                </div>
            )
    

        } else {
            // return <p>Loading...</p>
            return <Login />
        }
    }
}
