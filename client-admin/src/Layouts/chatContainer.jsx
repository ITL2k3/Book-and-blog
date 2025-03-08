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
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [receiverId, setReceiverId] = useState('');
    const [receiverAccount, setReceiverAccount] = useState(null);
    const [error, setError] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatWindows, setChatWindows] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [unreadMessages, setUnreadMessages] = useState(new Set());

    const fetchConversation = async () => {
        const response = await fetch(`http://${host}:3055/v1/api/get-all-conservation`, {
            credentials: 'include',
            method: 'GET',
        });
        const data = await response.json();
        console.log(data);
        setConversation(data.metadata);
        
        // Kiểm tra trạng thái online của tất cả users
        data.metadata.forEach(user => {
            socket.emit("checkOnline", user.user_id);
        });
    };

    useEffect(() => {
        socket.emit('userOnline', senderId);

        socket.on("userOnline", (userId) => {
            console.log('online detected');
            setOnlineUsers(prev => new Set([...prev, userId]));
        });

        socket.on("userOffline", (userId) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        });

        // Add listener for receiving messages
        socket.on("receiveMessage", async (data) => {
            // If current user is the receiver
            if (data.receiver_id === senderId) {
                // Đánh dấu cuộc trò chuyện có tin nhắn mới
                setUnreadMessages(prev => new Set([...prev, data.conversation_id]));
                
                fetchConversation();
                // Kiểm tra với state hiện tại
                const existingChat = chatWindows.find(
                    chat => chat.receiverId === data.sender_id || 
                           chat.conversationId === data.conversation_id
                );
                
                if (!existingChat) {
                    try {
                        const response = await fetch(`http://${host}:3055/v1/api/get-account-by-id?id=${data.sender_id}`, {
                            credentials: 'include',
                            method: 'GET',
                        });
                        const accountData = await response.json();
                        
                        if (accountData.statusCode === 200) {
                            // Kiểm tra lại một lần nữa trước khi thêm
                            setChatWindows(prevWindows => {
                                const chatExists = prevWindows.find(
                                    chat => chat.receiverId === data.sender_id || 
                                           chat.conversationId === data.conversation_id
                                );
                                
                                if (chatExists) {
                                    return prevWindows;
                                }
                                
                                return [...prevWindows, {
                                    receiverId: data.sender_id,
                                    receiverName: accountData.metadata.name,
                                    receiverRole: accountData.metadata.role,
                                    conversationId: data.conversation_id
                                }];
                            });
                        }
                    } catch (err) {
                        console.error('Error fetching sender account:', err);
                    }
                }
            }
        });

        fetchConversation();

        return () => {
            socket.off("userOnline");
            socket.off("userOffline");
            socket.off("receiveMessage");
        };
    }, []);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://${host}:3055/v1/api/get-account-by-id?id=${receiverId}`, {
                credentials: 'include',
                method: 'GET',
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
        //Kiểm tra xem người nhận có online không
        console.log('account: ', account);
        socket.emit("checkOnline", account.user_id);
        // Xóa trạng thái tin nhắn chưa đọc khi mở chat
        setUnreadMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(account.conversationId);
            return newSet;
        });
        // Kiểm tra xem chat window đã tồnại chưa
        const existingChat = chatWindows.find(chat => chat.receiverId === account.user_id);
        if (!existingChat) {
            setChatWindows([...chatWindows, {
                receiverId: account.user_id,
                receiverName: account.name,
                receiverRole: account.role,
                conversationId: account.conversationId
            }]);
        }
    };

    const handleCloseChat = (receiverId) => {
        setChatWindows(chatWindows.filter(chat => chat.receiverId !== receiverId));
    };

    const handleChatFocus = (conversationId) => {
        setUnreadMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(conversationId);
            return newSet;
        });
    };

    const UserItem = ({ receiverAccount }) => {
        const isOnline = onlineUsers.has(receiverAccount.user_id);
        const hasUnreadMessages = unreadMessages.has(receiverAccount.conversationId);
        
        return (
            <div 
                className={`account-info ${hasUnreadMessages ? 'unread-messages' : ''}`} 
                onClick={() => handleOpenChat(receiverAccount)}
            >
                <div className="account-avatar">
                    {receiverAccount.name.charAt(0).toUpperCase()}
                    {isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="account-details">
                    <p className={`account-name ${hasUnreadMessages ? 'unread-messages' : ''}`}>
                        {receiverAccount.name}
                    </p>
                    <p className="account-id">ID: {receiverAccount.user_id}</p>
                    <p className="account-role">Role: {receiverAccount.role === 'C' ? 'QTV' :
                    ( receiverAccount.role === 'A' ? 'ND' : 'KDV' ) }</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="search-account">
                <input
                    type="text"
                    value={ receiverId }
                    onChange={ (e) => setReceiverId(e.target.value) }
                    placeholder="Nhập ID người nhận..."
                    className="search-input"
                />
                <button onClick={ handleSearch } className="search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#fff" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/></svg>
                </button>
            </div>

            { error && <div className="error-message">{ error }</div> }

            { receiverAccount && <UserItem receiverAccount={receiverAccount} /> }
            
            <button 
                className="refresh-conversation-btn"
                onClick={fetchConversation}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20"/>
                </svg>
                <span>Làm mới</span>
            </button>

            { conversation && conversation.length > 0 ? (
                conversation.map((item) => (
                    <UserItem 
                        key={item.user_id} 
                        receiverAccount={item} 
                    />
                ))
            ) : (
                <div>Không có cuộc trò chuyện nào</div>
            )}
            {/* Chat Windows using Portal */ }
            { chatWindows.map((chat, index) => (
                createPortal(
                    <div 
                        key={chat.receiverId} 
                        className={`chat-window ${isChatVisible ? 'visible' : 'hidden'}`}
                        style={{
                            right: `${(index * 20.5) + 0.5}vw`
                        }}
                    >
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="chat-avatar">
                                    {chat.receiverName.charAt(0).toUpperCase()}
                                    {onlineUsers.has(chat.receiverId) && <div className="online-indicator"></div>}
                                </div>
                                <div className="chat-user-info">
                                    <p className="chat-name">{chat.receiverName}</p>
                                    <p className="chat-status" id={onlineUsers.has(chat.receiverId) ? 'online-text' : 'offline-text'}>
                                        {onlineUsers.has(chat.receiverId) ? 'Online' : 'Offline'}
                                    </p>
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
                            conversationId={chat.conversationId}
                            onFocus={handleChatFocus}
                        />
                    </div>,
                    document.body
                )
            )) }
        </>
    );
};

export default ChatContainer; 