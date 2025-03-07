import React, { useEffect, useState, useRef } from 'react';
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

const ChatComponent = ({ userId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            if (data.senderId === receiverId || data.receiverId === receiverId) {
                setMessages(prev => [...prev, data]);
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
            setMessages(prev => [...prev, newMessage]);
            setMessage("");
        }
    };

    return (
        <div className="chat-box">
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message-wrapper ${msg.senderId === userId ? 'sent' : 'received'}`}
                    >
                        <div className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
                            <div className="message-content">{msg.message}</div>
                            <div className="message-time">
                                {dayjs(msg.timestamp).format('HH:mm')}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form className="message-input-container" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
