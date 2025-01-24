import React, { useState, useEffect } from "react";
import axios from "axios"
import { host } from "../../host";
import { useParams, useNavigate } from 'react-router-dom'

const ChatPDF = ({ onPageChange }) => {
    const [file, setFile] = useState(null); // File PDF
    const [sourceId, setSourceId] = useState(""); // ID của nguồn PDF sau khi tải lên
    const [messages, setMessages] = useState([]); // Danh sách tin nhắn (người dùng & bot)
    const [input, setInput] = useState(""); // Nội dung câu hỏi



    const { query } = useParams()
    const queryArray = query.split('_')
    const arrayLength = queryArray.length
    const filename = queryArray[arrayLength - 1]
    const bookId = queryArray[arrayLength - 2]

    useEffect(() => {
        fetch(`http://${host}:3055/v1/api/read-book/sourceId/${filename}_${bookId}`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {

            setSourceId(await JSON.parse(await res.text()).metadata)
        }).catch((err) => {

        })
    }, [])


    const handleMessageClick = (pageNumber) => {
        // Gọi hàm để điều hướng đến trang PD
        onPageChange(pageNumber)
        // if (window.PDFViewer) {
        //     window.PDFViewer.goToPage(pageNumber); // Giả sử bạn đã định nghĩa goToPage trong PDFViewer
        // }
    };




    const handleSendMessage = async () => {

        if (!sourceId || !input.trim()) return;

        // Tin nhắn mới từ người dùng
        const newMessage = { role: "user", content: input };

        // Tạo một bản sao của messages, bao gồm cả tin nhắn mới
        const updatedMessages = [...messages, newMessage];

        // Cập nhật giao diện với tin nhắn mới
        setMessages(updatedMessages);

        // Cấu hình headers
        const config = {
            headers: {
                "x-api-key": "sec_jrP8IC3O6fPFk3wZMi0UNdSShrYXcEut", // Thay bằng API key của bạn
                "Content-Type": "application/json",
            },
        };

        // Dữ liệu gửi API
        const data = {

            "referenceSources": true,
            sourceId: sourceId, // Thay bằng sourceId của bạn
            messages: updatedMessages,
        };

        console.log("Data gửi API:", data);

        // Gửi yêu cầu API
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

                // Tin nhắn trả lời từ bot
                const botReply = { role: "assistant", content: responseData.content, references: responseData.references }
                setMessages((prev) => [...prev, botReply]);
            })
            .catch((error) => {
                console.error("Error:", error.message);
            });

        // Xóa input sau khi gửi
        setInput("");
    };

    return (

        <div style={ { maxWidth: "600px", margin: "0 auto", textAlign: "center" } }>
            <h1>ChatPDF</h1>
            <div style={ { margin: "20px 0", border: "1px solid #ccc", padding: "10px", minHeight: "200px", overflowY: "scroll" } }>
                { messages.map((msg, index) => (
                    <div key={ index } style={ { textAlign: msg.role === "user" ? "right" : "left", margin: "5px 0" } }>
                        <strong>{ msg.role === "user" ? "You" : "Bot" }:</strong>
                        { msg.content.split(' ').map((word, idx) => {
                            // Kiểm tra nếu từ có dạng [P2] hoặc [P5]
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
                    style={ { width: "70%", padding: "10px" } }
                />
                <button onClick={ handleSendMessage } style={ { padding: "10px", marginLeft: "5px" } }>
                    Send
                </button>
            </div>
        </div>


    );
};

export default ChatPDF;
