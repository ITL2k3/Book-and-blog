import Login from '../Login/Login'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'


import './detail.css'
import { host } from '../../host'

export default function Detail() {
    const navigate = useNavigate();
    // let refreshToken = document.cookie.refresh_Token
    // let rT = Cookies.get('refresh_token')
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    //set alert book storage
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [insideText, setInsideText] = useState(null)

    //set query and get BookId
    const { query } = useParams()
    const lastIndex = query.lastIndexOf("_");
    const BookId = query.substring(lastIndex + 1)


    const [isExpanded, setIsExpanded] = useState(false);
    const truncateDescription = (description) => {
        const words = description.split(' ');
        if (words.length > 200) {
            return words.slice(0, 200).join(' ') + '...';
        }
        return description;
    };

    useEffect(() => {

        // checkAuth('http://${host}:3055/v1/api/').then((res) => {
        //     if (res == false) {
        //         setValid(false)
        //     } else {
        //         setValid(true)
        //     }
        // })


        fetch(`http://${host}:3055/v1/api/book-detail/${BookId}`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
            const messageText = await res.text()

            const finalRes = JSON.parse(messageText)
            console.log(finalRes);
            setValid(true)
            if (finalRes.statusCode == 400) {
                setData(null)
                setValid(false)
            }
            
            console.log(finalRes);
            setData(finalRes.metadata)
        })
    }, [])



    if (isValid == null) {
        <p>Loading...</p>

    } else {
        if (isValid) {
            if (data != null) {
                let { title, filepath } = data
                let filename = filepath.split('/').pop().split('.').shift()
                return (
                    <div className="bookDetail">
                        <div className="img-container">
                            <img src={ data.thumbnail } alt="" />
                        </div>
                        <div className="book-text">
                            <h2>Sách: { data.title }</h2>
                            <h5>Tác giả: <span id="author">{ data.author }</span></h5>
                            <h5 id="cate">Thể loại: { data.categories.join(', ') }</h5>
                            <hr />
                            <p>{ isExpanded ? data.description : truncateDescription(data.description) }
                                { data.description.split(' ').length > 200 && (
                                    <>
                                        { !isExpanded ? (

                                            <span
                                                style={ { color: 'blue', cursor: 'pointer' } }
                                                onClick={ () => setIsExpanded(true) }
                                            >
                                                { ' ' }Đọc thêm
                                            </span>
                                        ) : (
                                            <span
                                                style={ { color: 'blue', cursor: 'pointer' } }
                                                onClick={ () => setIsExpanded(false) }
                                            >
                                                { '' }Thu gọn
                                            </span>
                                        ) }
                                    </>
                                ) }</p>
                        </div>
                        <div className="detail-option">
                            <div className="button-ctn-detail">
                                <button onClick={ () => {
                                    navigate(`/read/${title}_${BookId}_${filename}`)
                                } }>
                                    Đọc sách</button>

                                <button onClick={ () => {
                                    // /add-book-to-storage
                                    fetch(`http://${host}:3055/v1/api/add-book-to-storage`, {
                                        method: 'post',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ bookId: BookId }),
                                        credentials: 'include'
                                    }).then(async (res) => {
                                        const messageText = await res.text()
                                        const finalRes = JSON.parse(messageText)
                                        if (finalRes.statusCode == 400) {
                                            setInsideText("Sách đã tồn tại trong kho lưu trữ")
                                            setIsModalOpen(true)
                                        } else if (finalRes.statusCode == 401) {
                                            setInsideText("Bạn chưa đăng nhập!")
                                            setIsModalOpen(true)
                                        }
                                        else {
                                            setInsideText("Thêm sách thành công")
                                            setIsModalOpen(true)
                                        }

                                    })
                                } }> Thêm sách </button>
                                <div className="HR"></div>
                                <button>Báo lỗi</button>
                            </div>

                        </div>


                        { isModalOpen && (
                            <div className="tb-overlay">
                                <div className="Modal-tb">
                                    <div className="Nav-TB">
                                        <h2>Thông báo</h2>
                                        <button onClick={ (event) => { setIsModalOpen(false) } }>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z"/></svg></button>

                                    </div>
                                    <p>{ insideText }</p>
                                </div>
                            </div>) }

                    </div>
                )
            } else {
                
                return (
                    <div>
                        <h3>Not Found!</h3>
                    </div>
                )
            }


        } else {
            // return <p>Loading...</p>
            return (
                <div>
                    <h3>Not Found!</h3>
                </div>
            )
        }
    }
}
