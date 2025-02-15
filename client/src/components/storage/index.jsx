import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { Form, Link, Navigate, NavLink, Outlet, useActionData, useNavigate } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'
import InfiniteScroll from 'react-infinite-scroll-component'
import ReactPaginate from 'react-paginate'
import './storage.css'
import { host } from '../../host'
import MyLibrary from './MyLibrary'

export default function Storage() {
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    const [activeTab, setActiveTab] = useState('myLibrary') // state để theo dõi tab hiện tại
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
                <>
                    <div className="left-tool-bar">
                        <div style={ { justifyContent: "left" } } onClick={ () => setActiveTab('myLibrary') } id='filterbutton' className={ (activeTab === 'myLibrary') ? 'active' : '' }>
                            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z" /></svg>
                            <span>Drive</span>
                        </div>
                        <div onClick={ () => setActiveTab('sharedDocuments') } id='filterbutton' className={ (activeTab === 'sharedDocuments') ? 'active' : '' }>
                            <span>Tài liệu chia sẻ</span>
                        </div>

                    </div>

                    <div className="main-display-folder">
                        { activeTab === 'myLibrary' && (
                            <MyLibrary />
                        ) }
                        { activeTab === 'sharedDocuments' && (
                            <div>
                                {/* Nội dung liên quan đến tài liệu chia sẻ */ }
                                <h2>Tài liệu chia sẻ</h2>
                                {/* Thêm nội dung ở đây */ }
                            </div>
                        ) }
                    </div>
                </>
            )
        } else {
            navigate('/access')
        }
    }
}
