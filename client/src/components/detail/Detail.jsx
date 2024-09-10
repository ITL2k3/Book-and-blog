import Login from '../Login/Login'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'



export default function Detail() {
    const navigate = useNavigate();
    // let refreshToken = document.cookie.refresh_Token
    // let rT = Cookies.get('refresh_token')
    const [isValid, setValid] = useState(true)
    const [data, setData] = useState(null)
    //set alert book storage
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [insideText, setInsideText] = useState(null)

    //set query and get BookId
    const { query } = useParams()
    const lastIndex = query.lastIndexOf("_");
    const BookId = query.substring(lastIndex + 1)


    useEffect(() => {

        // checkAuth('http://localhost:3055/v1/api/').then((res) => {
        //     if (res == false) {
        //         setValid(false)
        //     } else {
        //         setValid(true)
        //     }
        // })


        fetch(`http://localhost:3055/v1/api/book-detail/${BookId}`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
            const messageText = await res.text()

            const finalRes = JSON.parse(messageText)
            if (finalRes.statusCode == 400) {
                setData(null)
            }
            setData(finalRes.metadata[0])
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
                        <img src={ data.thumbnail } alt="" />
                        <h2>{ data.title }</h2>
                        <h3>{ data.author }</h3>
                        <p>{ data.description }</p>
                        <button onClick={ () => {
                            navigate(`/read/${title}_${BookId}_${filename}`)
                        } }>Đọc sách</button>

                        <button onClick={ () => {
                            // /add-book-to-storage
                            fetch(`http://localhost:3055/v1/api/add-book-to-storage`, {
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
                                }else if(finalRes.statusCode == 401){
                                    setInsideText("Bạn chưa đăng nhập!")
                                    setIsModalOpen(true)
                                }
                                else{
                                    setInsideText("Thêm sách thành công")
                                    setIsModalOpen(true)
                                }

                            })
                        } }>Thêm sách</button>
                        { isModalOpen && (
                            <div>
                                <div>
                                    <h2>Thông báo</h2>
                                    <p>{insideText}</p>
                                    <button onClick={(event) => {setIsModalOpen(false)}}>Đóng</button>
                                </div>
                            </div>)}
                        
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
            return <Login />
        }
    }
}
