import React, { useState, useEffect } from 'react';
import ChatComponent from './chat';
import { host } from '../host';
import { io } from 'socket.io-client';
import { createPortal } from 'react-dom';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; // Import tiếng Việt

dayjs.extend(relativeTime);
dayjs.locale('vi'); // Thiết lập ngôn ngữ mặc định là tiếng Việt

const socket = io('http://localhost:3055');

const ChatContainer = ({ userId: senderId, isChatVisible }) => {
    const [receiverId, setReceiverId] = useState('');
    const [receiverAccount, setReceiverAccount] = useState(null);
    const [error, setError] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatWindows, setChatWindows] = useState([]);

    useEffect(() => {
        socket.emit('userOnline', senderId);
    }, []);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://${host}:3055/v1/api/get-account-by-id?id=${receiverId}`, {
                credentials: 'include'
            });
            
            const data = await response.json();
            if (data.statusCode === 200) {
                setReceiverAccount(data.metadata);
                setError('');
            } else if (data.statusCode === 404) {
                setError('Không tìm thấy tài khoản');
                setReceiverAccount(null);
            } else {
                setError('Có lỗi xảy ra khi tìm kiếm tài khoản');
                setReceiverAccount(null);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tìm kiếm tài khoản');
            setReceiverAccount(null);
        }
    };

    const handleOpenChat = (account) => {
        // Kiểm tra xem chat window đã tồnại chưa
        const existingChat = chatWindows.find(chat => chat.receiverId === account.user_id);
        if (!existingChat) {
            setChatWindows([...chatWindows, {
                receiverId: account.user_id,
                receiverName: account.name,
                receiverRole: account.role
            }]);
        }
    };

    const handleCloseChat = (receiverId) => {
        setChatWindows(chatWindows.filter(chat => chat.receiverId !== receiverId));
    };

    return (
        <>
            <div className="search-account">
                <input
                    type="text"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    placeholder="Nhập ID người nhận..."
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">
                    Tìm kiếm
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {receiverAccount && (
                <div className="account-info" onClick={() => handleOpenChat(receiverAccount)}>
                    <div className="account-avatar">
                        {receiverAccount.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="account-details">
                        <p className="account-name">{receiverAccount.name}</p>
                        <p className="account-id">ID: {receiverAccount.user_id}</p>
                        <p className="account-role">Role: {receiverAccount.role}</p>
                    </div>
                </div>
            )}

            {/* Chat Windows using Portal */}
            {chatWindows.map((chat, index) => (
                createPortal(
                    <div key={chat.receiverId} className={`chat-window ${isChatVisible ? 'visible' : 'hidden'}`}>
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="chat-avatar">
                                    {chat.receiverName.charAt(0).toUpperCase()}
                                </div>
                                <div className="chat-user-info">
                                    <p className="chat-name">{chat.receiverName}</p>
                                    <p className="chat-status">Online</p>
                                </div>
                            </div>
                            <button 
                                className="close-chat"
                                onClick={() => handleCloseChat(chat.receiverId)}
                            >
                                ×
                            </button>
                        </div>
                        <ChatComponent 
                            userId={senderId} 
                            receiverId={chat.receiverId}
                        />
                    </div>,
                    document.body
                )
            ))}
        </>
    );
};

export default ChatContainer;
