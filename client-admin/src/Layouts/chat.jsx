import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { host } from '../host';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; // Import tiếng Việt

dayjs.extend(relativeTime);
dayjs.locale('vi'); // Thiết lập ngôn ngữ mặc định là tiếng Việt

const socket = io('http://localhost:3055');

const ChatComponent = ({ userId, receiverId, conversationId, onFocus }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    
    // Tạo âm thanh thông báo tùy chỉnh
    const notificationSound = new Audio('/sounds/notification.wav');
    
    // Tải trước âm thanh để tránh độ trễ khi phát lần đầu
    useEffect(() => {
        notificationSound.load();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessage = async () => {
            const response = await fetch(`http://${host}:3055/v1/api/get-message-by-conversation-id?conversationId=${conversationId}`, {
                credentials: 'include',
                method: 'GET',
            })
            const data = await response.json()
            console.log(data);
            setMessages(data.metadata)
        }
        fetchMessage()
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        socket.on("receiveMessage", (data) => { 
            console.log('rc: ',data);

            if (data.conversation_id == conversationId) {
                const formattedMessage = {
                    sender_id: data.sender_id,
                    receiver_id: data.receiver_id,
                    message: data.message,
                    timestamp: data.timestamp,
                    conversation_id: conversationId
                };
                if (data.sender_id === receiverId || data.receive_id === receiverId) {
                    // Phát âm thanh khi nhận tin nhắn từ người khác
                    if (data.sender_id !== userId) {
                        notificationSound.play().catch(err => console.log('Error playing sound:', err));
                    }
                    setMessages(prev => [...prev, formattedMessage]);
                }
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [receiverId]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const newMessage = {
                senderId: userId,
                receiverId: receiverId,
                message,
                timestamp: new Date().toISOString()
            };
            socket.emit("sendMessage", newMessage);

            const formattedMessage = {
                sender_id: userId,
                receiver_id: receiverId,
                message: message,
                timestamp: new Date().toISOString(),
                conversation_id: conversationId
            };

            setMessages(prev => [...prev, formattedMessage]);
            setMessage("");
        }
    };

    const handleInputFocus = () => {
        if (onFocus) {
            onFocus(conversationId);
        }
    };

    return (
        <div className="chat-box">
            <div className="messages-container">
                { messages.map((msg, index) => (
                    <div
                        key={ index }
                        className={ `message-wrapper ${msg.sender_id === userId ? 'sent' : 'received'}` }
                    >
                        <div className={ `message ${msg.sender_id === userId ? 'sent' : 'received'}` }>
                            <div className="message-content">{ msg.message }</div>
                            <div className="message-time">
                                { dayjs(msg.timestamp).format('HH:mm') }
                            </div>
                        </div>
                    </div>
                )) }
                <div ref={ messagesEndRef } />
            </div>
            <form className="message-input-container" onSubmit={ sendMessage }>
                <input
                    type="text"
                    value={ message }
                    onChange={ (e) => setMessage(e.target.value) }
                    onFocus={ handleInputFocus }
                    placeholder="Nhập tin nhắn..."
                    className="message-input"
                />
                <button type="submit" className="send-button">
                    Gửi
                </button>
            </form>
        </div>
    );
};

export default ChatComponent; 