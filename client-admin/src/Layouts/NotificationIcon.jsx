import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
// import NotificationList from './NotificationList';
// import './NotificationIcon.css'; // File CSS tùy chỉnh

const socket = io('http://localhost:3055');

const NotificationIcon = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Đăng ký quản trị viên
        // socket.emit('admin_join');

        // Nhận thông báo real-time
        // socket.on('receive_notification', (data) => {
        //     setNotifications((prev) => [data, ...prev]);
        //     setUnreadCount((prev) => prev + 1);
        // });
    
        socket.on('receive_notification', (data) => {
            console.log(data);
            console.log(socket.id)
        });
        return () => {
            socket.off('receive_notification');
        };
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setUnreadCount(0); // Đánh dấu tất cả là đã đọc
    };

    return (
        <div className="notification-container">
            <div className="notification-icon" onClick={ handleToggle }>
                🔔
                { unreadCount > 0 && <span className="notification-badge">{ unreadCount }</span> }
            </div>
            {/* { isOpen && <NotificationList notifications={ notifications } /> } */}
        </div>
    );
};

export default NotificationIcon;
