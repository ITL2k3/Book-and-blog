import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { Form, Link, Navigate, NavLink, Outlet, useActionData, useNavigate } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'
import InfiniteScroll from 'react-infinite-scroll-component'
import ReactPaginate from 'react-paginate'
import './storage.css'
import { host } from '../../host'
import Dashboard from './db'
import DbUser from './dbUser'
export default function DashBoardIndex() {
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    const [activeTab, setActiveTab] = useState('DBDoc') // state để theo dõi tab hiện tại
    const navigate = useNavigate()

    useEffect(() => {
        checkAuth(`http://${host}:3055/v1/api/`).then((res) => {
            if (res == false) {
                setValid(false)
            } else {
                setValid(true)
                setData(res)
            }
        })
    }, [])

    if (isValid == null) {
        return <p>Loading...</p>
    } else {
        if (isValid) {
            return (
                <div className="dashboard-layout">
                    <div className="left-tool-bar-tk">
                        <div onClick={ () => setActiveTab('DBDoc') } id='filterbutton' className={ (activeTab === 'DBDoc') ? 'active' : '' }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z" /></svg>
                            <span>Thống kê tài liệu</span>
                        </div>
                        <div onClick={ () => setActiveTab('DBUser') } id='filterbutton' className={ (activeTab === 'DBUser') ? 'active' : '' }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#222" d="M9.17 6H4v12h16V8h-8.83zM16 13h-3v4h-2v-4H8l4.01-4z" opacity="0.3"/><path fill="#222" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m0 12H4V6h5.17l2 2H20z"/><path fill="#222" d="M11 13v4h2v-4h3l-3.99-4L8 13z"/></svg>
                            <span>Thống kê người dùng</span>
                        </div>
                    </div>

                    <div className="main-display-folder">
                        { activeTab === 'DBDoc' && (
                            <Dashboard />
                        ) }
                        { activeTab === 'DBUser' && (
                            <DbUser />
                        ) }
                    </div>
                </div>
            )
        } else {
            navigate('/access')
        }
    }
}
