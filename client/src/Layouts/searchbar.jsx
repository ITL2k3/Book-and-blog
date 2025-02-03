import React, { useState, useEffect, useRef } from "react";
import { host } from "../host";


const SearchBar = () => {
    const [query, setQuery] = useState(""); // Từ khóa tìm kiếm
    const [results, setResults] = useState([]); // Kết quả tìm kiếm
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
            fetch(`http://${host}:3055/v1/api/search-doc?query=${query}`, {
                method: "get",
                credentials: "include",
            }).then(async (res) => {
                const messageText = await res.text();
                const result = JSON.parse(messageText);

                setResults(result.metadata); // Cập nhật kết quả tìm kiếm
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
            
            {/* Danh sách kết quả tìm kiếm */ }
            { isFocused && results.length > 0 && (
                <div className="search_item_container">
                    { results.map((result, index) => (
                        
                            <div className="search_item" key={ index }  >
                                <img
                                    src={ result._source.thumbnail }

                                    className="search_item_thumbnail"
                                />
                                    
                                {/* href= */}
                                <div className="search_item_info">
                                    <p className="search_item_title">{ result._source.title }</p>
                                    <p className="search_item_author">{ result._source.author }</p>
                                    
                                </div>
                                <button className="but_todetail" onClick = {() => {
                                    window.location.href =`/detail/${result._source.title}_${result._id}`
                                }}><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="20px" height="20px"><path d="M 14.980469 2.980469 C 14.164063 2.980469 13.433594 3.476563 13.128906 4.230469 C 12.820313 4.984375 13.003906 5.847656 13.585938 6.414063 L 32.171875 25 L 13.585938 43.585938 C 13.0625 44.085938 12.851563 44.832031 13.035156 45.535156 C 13.21875 46.234375 13.765625 46.78125 14.464844 46.964844 C 15.167969 47.148438 15.914063 46.9375 16.414063 46.414063 L 36.414063 26.414063 C 37.195313 25.632813 37.195313 24.367188 36.414063 23.585938 L 16.414063 3.585938 C 16.035156 3.199219 15.519531 2.980469 14.980469 2.980469 Z"/></svg></button>
                            </div>
                        

                    )) }
                </div>
            ) }
        </div>
    );
};
export default SearchBar;
