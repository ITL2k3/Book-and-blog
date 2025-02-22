import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { host } from "../../host";
import { useParams } from 'react-router-dom';
import './chatpdf.css'
import ReactMarkdown from 'react-markdown';


const ChatPDF = ({ onPageChange }) => {
    const [file, setFile] = useState(null); // File PDF
    const [sourceId, setSourceId] = useState(""); // ID của nguồn PDF sau khi tải lên
    const [userId, setUserId] = useState("")
    const [messages, setMessages] = useState([]); // Danh sách tin nhắn (người dùng & bot)
    const [input, setInput] = useState(""); // Nội dung câu hỏi
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState(false)
    const chatRef = useRef(null);

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
            const result = await JSON.parse(await res.text()).metadata

            const sourceid = result.source_id_chatPDF
            setUserId(result.userId)
            const savedMessages = localStorage.getItem(`${result.userId}_${sourceid}`);
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }

            setSourceId(sourceid);



        }).catch((err) => {
            console.error(err);
        });
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const handleMessageClick = (pageNumber) => {
        onPageChange(pageNumber);
    };




    const handleSendMessage = async () => {
        if (!sourceId || !input.trim()) return;
        setIsFetching(true)
        // Tin nhắn mới từ người dùng
        const newMessage = { role: "user", content: input };
        const updatedMessages = [...messages, newMessage];

        // Cập nhật giao diện với tin nhắn mới
        setMessages(updatedMessages);

        // Lưu tin nhắn vào local storage
        console.log(sourceId);
        if (sourceId != 'null') localStorage.setItem(`${userId}_${sourceId}`, JSON.stringify(updatedMessages));


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
                setIsFetching(false)
                // Cập nhật lại local storage
                console.log(sourceId);
                if (sourceId != 'null') localStorage.setItem(`${userId}_${sourceId}`, JSON.stringify(updatedMessagesWithBot));

            })
            .catch((error) => {
                console.error("Error:", error.message);
                setIsFetching(false)
                setError("chatPDF internal server error!")

            });

        setInput("");
    };

    const handleDelete = () => {
        setMessages([])
        setError(false)
        localStorage.removeItem(`${userId}_${sourceId}`)
    }

    function convertString(input) {
        return input.replace(/(\d+)?\s*\[P(\d+)\]/g, ' [$2]()');
    }
    return (
        <div className="chat_container">
            <div className="chat-header">
                <h1>Trò chuyện</h1>
                <div id="delete-icon-chat-bot-ctn" onClick={ handleDelete }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#646464" d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1zM7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21z" /></svg>

                </div>
            </div>

            <div className="chat-content" ref={ chatRef }>
                { messages.map((msg, index) => (
                    msg.role === "user" ? (
                        <div key={ index } className="user-box-chat">
                            <ReactMarkdown
                                components={ {
                                    a: ({ href, children }) => (
                                        <span style={ { color: "#2596BE" } } onClick={ () => handleMessageClick(children) }>
                                            { children }
                                        </span>
                                    ),
                                } }
                            >
                                { convertString(msg.content) }
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="bot-box-chat-ctn">
                            <div style={ { marginRight: "15px" } }>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                    <radialGradient id="oDvWy9qKGfkbPZViUk7TCa_eoxMN35Z6JKg_gr1" cx="-670.437" cy="617.13" r=".041" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1ba1e3"></stop><stop offset="0" stop-color="#1ba1e3"></stop><stop offset=".3" stop-color="#5489d6"></stop><stop offset=".545" stop-color="#9b72cb"></stop><stop offset=".825" stop-color="#d96570"></stop><stop offset="1" stop-color="#f49c46"></stop></radialGradient><path fill="url(#oDvWy9qKGfkbPZViUk7TCa_eoxMN35Z6JKg_gr1)" d="M22.882,31.557l-1.757,4.024c-0.675,1.547-2.816,1.547-3.491,0l-1.757-4.024	c-1.564-3.581-4.378-6.432-7.888-7.99l-4.836-2.147c-1.538-0.682-1.538-2.919,0-3.602l4.685-2.08	c3.601-1.598,6.465-4.554,8.002-8.258l1.78-4.288c0.66-1.591,2.859-1.591,3.52,0l1.78,4.288c1.537,3.703,4.402,6.659,8.002,8.258	l4.685,2.08c1.538,0.682,1.538,2.919,0,3.602l-4.836,2.147C27.26,25.126,24.446,27.976,22.882,31.557z"></path><radialGradient id="oDvWy9qKGfkbPZViUk7TCb_eoxMN35Z6JKg_gr2" cx="-670.437" cy="617.13" r=".041" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1ba1e3"></stop><stop offset="0" stop-color="#1ba1e3"></stop><stop offset=".3" stop-color="#5489d6"></stop><stop offset=".545" stop-color="#9b72cb"></stop><stop offset=".825" stop-color="#d96570"></stop><stop offset="1" stop-color="#f49c46"></stop></radialGradient><path fill="url(#oDvWy9qKGfkbPZViUk7TCb_eoxMN35Z6JKg_gr2)" d="M39.21,44.246l-0.494,1.132	c-0.362,0.829-1.51,0.829-1.871,0l-0.494-1.132c-0.881-2.019-2.467-3.627-4.447-4.506l-1.522-0.676	c-0.823-0.366-0.823-1.562,0-1.928l1.437-0.639c2.03-0.902,3.645-2.569,4.511-4.657l0.507-1.224c0.354-0.853,1.533-0.853,1.886,0	l0.507,1.224c0.866,2.088,2.481,3.755,4.511,4.657l1.437,0.639c0.823,0.366,0.823,1.562,0,1.928l-1.522,0.676	C41.677,40.619,40.091,42.227,39.21,44.246z"></path>
                                </svg>
                            </div>
                            <div key={ index } className="bot-box-chat">
                                {error ? <p>{error}</p> : <ReactMarkdown
                                    components={ {
                                        a: ({ href, children }) => (
                                            <span style={ { color: "#2596BE" } } onClick={ () => handleMessageClick(children) }>
                                                { children }
                                            </span>
                                        ),
                                    } }
                                >
                                    { convertString(msg.content) }
                                </ReactMarkdown> }
                                
                            </div>
                        </div>

                    )
                )) }
                { isFetching && (
                    <div style={ { marginLeft: "-30px" } }>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                            <radialGradient id="oDvWy9qKGfkbPZViUk7TCa_eoxMN35Z6JKg_gr1" cx="-670.437" cy="617.13" r=".041" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1ba1e3"></stop><stop offset="0" stop-color="#1ba1e3"></stop><stop offset=".3" stop-color="#5489d6"></stop><stop offset=".545" stop-color="#9b72cb"></stop><stop offset=".825" stop-color="#d96570"></stop><stop offset="1" stop-color="#f49c46"></stop></radialGradient><path fill="url(#oDvWy9qKGfkbPZViUk7TCa_eoxMN35Z6JKg_gr1)" d="M22.882,31.557l-1.757,4.024c-0.675,1.547-2.816,1.547-3.491,0l-1.757-4.024	c-1.564-3.581-4.378-6.432-7.888-7.99l-4.836-2.147c-1.538-0.682-1.538-2.919,0-3.602l4.685-2.08	c3.601-1.598,6.465-4.554,8.002-8.258l1.78-4.288c0.66-1.591,2.859-1.591,3.52,0l1.78,4.288c1.537,3.703,4.402,6.659,8.002,8.258	l4.685,2.08c1.538,0.682,1.538,2.919,0,3.602l-4.836,2.147C27.26,25.126,24.446,27.976,22.882,31.557z"></path><radialGradient id="oDvWy9qKGfkbPZViUk7TCb_eoxMN35Z6JKg_gr2" cx="-670.437" cy="617.13" r=".041" gradientTransform="matrix(128.602 652.9562 653.274 -128.6646 -316906.281 517189.719)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1ba1e3"></stop><stop offset="0" stop-color="#1ba1e3"></stop><stop offset=".3" stop-color="#5489d6"></stop><stop offset=".545" stop-color="#9b72cb"></stop><stop offset=".825" stop-color="#d96570"></stop><stop offset="1" stop-color="#f49c46"></stop></radialGradient><path fill="url(#oDvWy9qKGfkbPZViUk7TCb_eoxMN35Z6JKg_gr2)" d="M39.21,44.246l-0.494,1.132	c-0.362,0.829-1.51,0.829-1.871,0l-0.494-1.132c-0.881-2.019-2.467-3.627-4.447-4.506l-1.522-0.676	c-0.823-0.366-0.823-1.562,0-1.928l1.437-0.639c2.03-0.902,3.645-2.569,4.511-4.657l0.507-1.224c0.354-0.853,1.533-0.853,1.886,0	l0.507,1.224c0.866,2.088,2.481,3.755,4.511,4.657l1.437,0.639c0.823,0.366,0.823,1.562,0,1.928l-1.522,0.676	C41.677,40.619,40.091,42.227,39.21,44.246z"></path>
                        </svg>
                        <svg style={{marginLeft: "20px"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="10" height="10" x="1" y="1" fill="#535353" rx="1"><animate id="svgSpinnersBlocksShuffle30" fill="freeze" attributeName="x" begin="0;svgSpinnersBlocksShuffle3b.end" dur="0.2s" values="1;13"/><animate id="svgSpinnersBlocksShuffle31" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle38.end" dur="0.2s" values="1;13"/><animate id="svgSpinnersBlocksShuffle32" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle39.end" dur="0.2s" values="13;1"/><animate id="svgSpinnersBlocksShuffle33" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle3a.end" dur="0.2s" values="13;1"/></rect><rect width="10" height="10" x="1" y="13" fill="#535353" rx="1"><animate id="svgSpinnersBlocksShuffle34" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle30.end" dur="0.2s" values="13;1"/><animate id="svgSpinnersBlocksShuffle35" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle31.end" dur="0.2s" values="1;13"/><animate id="svgSpinnersBlocksShuffle36" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle32.end" dur="0.2s" values="1;13"/><animate id="svgSpinnersBlocksShuffle37" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle33.end" dur="0.2s" values="13;1"/></rect><rect width="10" height="10" x="13" y="13" fill="#535353" rx="1"><animate id="svgSpinnersBlocksShuffle38" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle34.end" dur="0.2s" values="13;1"/><animate id="svgSpinnersBlocksShuffle39" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle35.end" dur="0.2s" values="13;1"/><animate id="svgSpinnersBlocksShuffle3a" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle36.end" dur="0.2s" values="1;13"/><animate id="svgSpinnersBlocksShuffle3b" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle37.end" dur="0.2s" values="1;13"/></rect></svg>
                    </div>
                ) }
            </div>

            <div>
                <input
                    type="text"
                    value={ input }
                    onChange={ (e) => setInput(e.target.value) }
                    placeholder="Hỏi..."
                    className="chat-input"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}

                />
                <button onClick={ handleSendMessage } className="chat-send">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#fff" d="M3 20v-6l8-2l-8-2V4l19 8z" /></svg>
                </button>
            </div>
        </div>
    );
};

export default ChatPDF;
