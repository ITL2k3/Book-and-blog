import React, { useState, useEffect, useRef } from "react";
import { host } from '../../host.js';

const SmallSearchBar = ({setF}) => {
    const [query, setQuery] = useState(""); // Từ khóa tìm kiếm
    const [isTyping, setIsTyping] = useState(false); // Trạng thái gõ phím
    const [isFocused, setIsFocused] = useState(false); // Trạng thái focus của input
    const searchRef = useRef(null); // Tham chiếu để kiểm tra focus\
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isTyping) {
                fetchResults(); // Gửi API tìm kiếm sau khi debounce
                setIsTyping(false);
            }
        }, 500); // Debounce 500ms

        return () => clearTimeout(timer); // Xóa timeout nếu người dùng tiếp tục gõ
    }, [query]);

    const fetchResults = async () => {
        if (query.trim() === "") {
            setResults([]); // Xóa kết quả nếu không có từ khóa
            return;
        }

        try {
            fetch(`http://${host}:3055/v1/api/user/search-book-upload?title=${query}`, {
                method: "get",
                credentials: "include",
            }).then(async (res) => {
                const messageText = await res.text();
                const result = JSON.parse(messageText);
                console.log(result);
                setF(result.metadata)
            });
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value); // Cập nhật từ khóa
        setIsTyping(true); // Người dùng đang nhập
    };

    const handleFocus = () => {
        setIsFocused(true); // Hiển thị danh sách khi focus
    };

    const handleBlur = (e) => {
        // Kiểm tra nếu blur không phải do click vào phần tử bên trong container
        if (!searchRef.current.contains(e.relatedTarget)) {
            setIsFocused(false); // Ẩn danh sách
        }
    };

   

    return (
        <div
            className="search_global"
            id="small_search_udt"
            onBlur={ handleBlur }
            onFocus={ handleFocus }
            ref={ searchRef }
            tabIndex={ -1 } // Cho phép container nhận focus
        >
            <input
                className="search_input"
                type="text"
                placeholder="Tìm kiếm..."
                value={ query }
                onChange={ handleChange }
                style={ {
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    marginBottom: "5px",
                } }
            />
            
          
        </div>
    );
};
export default SmallSearchBar;
