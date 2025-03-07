import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { host } from '../host';
// import NotificationList from './NotificationList';
// import './NotificationIcon.css'; // File CSS tùy chỉnh

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; // Import tiếng Việt


dayjs.extend(relativeTime);
dayjs.locale('vi'); // Thiết lập ngôn ngữ mặc định là tiếng Việt

const socket = io('http://localhost:3055');

const NotificationIcon = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const [mode, setMode] = useState('All')

    //Noti
    const [notiOpen, setNotiOpen] = useState(false)
    const [clickedNoti, setClickedNoti] = useState(null)
    const handleAllClick = () => {
        setMode('All')
        getNoti()
    }
    const handleOnlyClick = () => {
        setMode('Only')
        getNoti(0)
    }
    const handleRefreshClick = () => {
        mode == 'All' ? getNoti() : getNoti(0)
    }

    const handleNotiItemClick = (Noti) => {
        setNotiOpen(true)
        setClickedNoti(Noti)
        //update-read-noti
        console.log('nt: ', Noti);
        Noti.is_read = 1;
        fetch(`http://${host}:3055/v1/api/update-read-noti`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ reportId: Noti.report_id })
        })
        setUnreadCount(unreadCount - 1)
    }
    const DisplayNoti = () => {
        return (
            <div className="modal-add-ovl">
                <div className="modal3" style={ { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }>
                    <div className="modal-content3" id="report-ctn">
                        <h4>Báo cáo</h4>
                        <p>Từ người dùng <b>{clickedNoti.user_id}</b></p> 
                        <p>Tiêu đề: <b>{clickedNoti.title}</b></p>
                        <p>Tác giả tài liệu: <b>{clickedNoti.author_id}</b></p> 
                       
                        <p > { clickedNoti.message }</p>
                        
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div id="ntf-time">{ dayjs(clickedNoti.create_at).fromNow() }</div>
                            <div>
                            <button onClick={ () => {
                                setNotiOpen(false)
                            } }>Thoát</button>
                            <button onClick = {() => {
                                    window.location.href =`/detail/${clickedNoti.book_id}`}}>
                                Xem 
                            </button>
                            </div>
                          
                        </div>


                    </div>
                </div>
            </div>
        )
    }

    const DropDownNotification = () => {
        return (
            <div className="drop-down-container " id="not-ctn" >
                <h3 style={ { padding: "10px", paddingBottom: "0px" } }>Thông báo</h3>
                <button id={ mode == 'All' ? "enable-ntf-btn" : "" } onClick={ handleAllClick }>Tất cả</button>
                <button id={ mode == 'All' ? "" : "enable-ntf-btn" } onClick={ handleOnlyClick }>Chưa đọc</button>
                <button onClick={ handleRefreshClick } >Tải lại</button>

                <div className="notify-container">
                    { !notifications.length && <span style={ { marginLeft: "15px" } }>không có thông báo nào</span> }
                    { notifications.map(ntf => {
                        return <div className="ntf-item" onClick={ () => handleNotiItemClick(ntf) } >

                            <div id="ntf-us-id"> <b>{ntf.title}</b></div>
                            <div id="ntf-msg">{ ntf.message }</div>
                            <div className="ntf-info-btm">

                                <div id="ntf-time">{ dayjs(ntf.create_at).fromNow() }</div>
                                <div>
                                    { ntf.is_read == 0 ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#4fa2ff" d="M22 8.98V18c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10.1c-.06.32-.1.66-.1 1c0 1.48.65 2.79 1.67 3.71L12 11L4 6v2l8 5l5.3-3.32c.54.2 1.1.32 1.7.32c1.13 0 2.16-.39 3-1.02M16 5c0 1.66 1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3" /></svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#959595" d="M12 19a6.995 6.995 0 0 1 10-6.32V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8.08c-.05-.33-.08-.66-.08-1M4 6l8 5l8-5v2l-8 5l-8-5zm13.34 16l-3.54-3.54l1.41-1.41l2.12 2.12l4.24-4.24L23 16.34z" /></svg>
                                    }
                                </div>


                            </div>
                        </div>
                    }) }

                </div>
            </div>
        )
    }


    const getNoti = async (is_read = null) => {
        fetch(`http://${host}:3055/v1/api/get-noti-info?is_read=${is_read}`, {
            method: 'get',
            credentials: 'include',

        }).then(async (res) => {
            const messageText = await res.text()

            const finalRes = JSON.parse(messageText)


            setNotifications(finalRes.metadata.notiMessage)
            setUnreadCount(finalRes.metadata.unreadCount)




        })
    }
    useEffect(() => {


        getNoti()


        socket.on('receive_notification', (data) => {

            setNotifications((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);


        });
        return () => {
            socket.off('receive_notification');
            console.log('cpn um');
        };
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);

    };

    return (
        <div className="notification-container">
            <button id="advance-icon" onClick={ handleToggle }>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#000" d="M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2a8.45 8.45 0 0 1 3.55-6.42m12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43a8.5 8.5 0 0 1 3.54 6.42M18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-6 11c.14 0 .27-.01.4-.04c.65-.14 1.18-.58 1.44-1.18q.15-.36.15-.78h-4c.01 1.1.9 2 2.01 2" /></svg>
                { unreadCount > 0 && <span id="notification-badge">{ unreadCount }</span> }
            </button>
            { isOpen && <DropDownNotification /> }
            { notiOpen && <DisplayNoti /> }
        </div>
    );
};

export default NotificationIcon;
