import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'


export default function About() {
    // let refreshToken = document.cookie.refresh_Token
    // let rT = Cookies.get('refresh_token')
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    useEffect(() => {
        
        checkAuth('http://localhost:4000/api/about').then((res) => {
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
                <div className="about">
                    <h2>{data.Group}</h2>
                    <p>
                        year: {data.year}
                    </p>
                    <p>
                        CEO: {data.CEO}
                    </p>
                </div>
            )

        } else {
            // return <p>Loading...</p>
            return <Login />
        }
    }
}
