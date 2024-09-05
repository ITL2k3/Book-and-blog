import Login from '../Login/Login'
import { useEffect,useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'



export default function Detail() {
    const navigate = useNavigate();
    // let refreshToken = document.cookie.refresh_Token
    // let rT = Cookies.get('refresh_token')
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    //set query and get BookId
    const {query} = useParams()
    const lastIndex = query.lastIndexOf("_");
    const BookId = query.substring(lastIndex + 1)
    

    useEffect(() => {
        
        checkAuth('http://localhost:3055/v1/api/').then((res) => {
            if(res == false){
                setValid(false)
            }else{
                setValid(true)
            }
        })


        fetch(`http://localhost:3055/v1/api/book-detail/${BookId}`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
            const messageText = await res.text()
            
            const finalRes = JSON.parse(messageText)
            if(finalRes.statusCode == 400){
                setData(null)
            }
            setData(finalRes.metadata[0])
        })
    }, [])



    if (isValid == null) {
        <p>Loading...</p>
        
    } else {
        if (isValid) {
            if(data != null){
                console.log(data);
                let {title, filepath} = data
                let filename = filepath.split('/').pop().split('.').shift()
                return (
                    <div className="bookDetail">
                        <img src={data.thumbnail} alt="" />
                        <h2>{data.title}</h2>
                        <h3>{data.author}</h3>
                        <p>{data.description}</p>
                        <button onClick={() => {
                            navigate(`/read/${title}_${BookId}_${filename}`)
                        }}>Đọc sách</button>
                        
                        
                    </div>
                )
            }else{
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
