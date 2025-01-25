import React, { useState, useEffect } from "react";
import axios from "axios";
import { host } from "../../host";
import { useParams } from 'react-router-dom';

const ChatPDF = ({ onPageChange }) => {
    const [file, setFile] = useState(null); // File PDF
    const [sourceId, setSourceId] = useState(""); // ID của nguồn PDF sau khi tải lên
    const [messages, setMessages] = useState([]); // Danh sách tin nhắn (người dùng & bot)
    const [input, setInput] = useState(""); // Nội dung câu hỏi

    const { query } = useParams();
    const queryArray = query.split('_');
    const arrayLength = queryArray.length;
    const filename = queryArray[arrayLength - 1];
    const bookId = queryArray[arrayLength - 2];

    useEffect(() => {
        // Tải tin nhắn từ local storage


        fetch(`http://${host}:3055/v1/api/read-book/sourceId/${filename}_${bookId}`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
            const sourceid = await JSON.parse(await res.text()).metadata
            const savedMessages = localStorage.getItem(sourceid);
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
            
            setSourceId(sourceid);
            
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const handleMessageClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    const handleSendMessage = async () => {
        if (!sourceId || !input.trim()) return;

        // Tin nhắn mới từ người dùng
        const newMessage = { role: "user", content: input };
        const updatedMessages = [...messages, newMessage];

        // Cập nhật giao diện với tin nhắn mới
        setMessages(updatedMessages);

        // Lưu tin nhắn vào local storage
        localStorage.setItem(sourceId, JSON.stringify(updatedMessages));

        const config = {
            headers: {
                "x-api-key": "sec_jrP8IC3O6fPFk3wZMi0UNdSShrYXcEut", // Thay bằng API key của bạn
                "Content-Type": "application/json",
            },
        };

        const data = {
            "referenceSources": true,
            sourceId: sourceId,
            messages: updatedMessages,
        };

        console.log("Data gửi API:", data);

        fetch("https://api.chatpdf.com/v1/chats/message", {
            method: "POST",
            headers: config.headers,
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to send message");
                }
                return response.json();
            })
            .then((responseData) => {
                console.log("Result:", responseData);

                const botReply = { role: "assistant", content: responseData.content, references: responseData.references };
                const updatedMessagesWithBot = [...updatedMessages, botReply];

                setMessages(updatedMessagesWithBot);
                // Cập nhật lại local storage
                localStorage.setItem(sourceId, JSON.stringify(updatedMessagesWithBot));

            })
            .catch((error) => {
                console.error("Error:", error.message);
            });

        setInput("");
    };

    return (
        <div className="chat_container">
            <h1>ChatPDF</h1>
            <div >
                { messages.map((msg, index) => (
                    <div key={ index } >
                        <strong>{ msg.role === "user" ? "You" : "Bot" }:</strong>
                        { msg.content.split(' ').map((word, idx) => {
                            const match = word.match(/\[P(\d+)\]/);
                            if (match) {
                                const pageNumber = match[1];
                                return (
                                    <span key={ idx } onClick={ () => handleMessageClick(pageNumber) } style={ { cursor: 'pointer', color: 'blue' } }>
                                        { word }
                                    </span>
                                );
                            }
                            return ` ${word} `;
                        }) }
                    </div>
                )) }
            </div>
            <div>
                <input
                    type="text"
                    value={ input }
                    onChange={ (e) => setInput(e.target.value) }
                    placeholder="Ask a question..."
                    className="chat-input"
                   
                />
                <button onClick={ handleSendMessage } className="chat-send">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPDF;
