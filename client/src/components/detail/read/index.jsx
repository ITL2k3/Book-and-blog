
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Login from '../../Login/Login';
import checkAuth, { checkDevTool } from '../../../Auth/checkAuth';
import PDFViewer from './pdfviewer';


export default function Read() {
    const navigate = useNavigate();
    // let refreshToken = document.cookie.refresh_Token
    // let rT = Cookies.get('refresh_token')
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    //set query and get BookId
    const { query } = useParams()
    const queryArray = query.split('_')
    const arrayLength = queryArray.length
    const filename = queryArray[arrayLength - 1]
    const bookId = queryArray[arrayLength - 2]
    //setBuffer
    const [buffer, setBuffer] = useState(null);

    
   
    useEffect(() => {
        const handleKeyDown = (event) => {
            event.preventDefault(); // Ngăn chặn hành động mặc định
          };
      
          // Thêm sự kiện keydown
          window.addEventListener('keydown', handleKeyDown);
      
          
        const checkdev = setInterval(checkDevTool, 500)
        

        checkAuth('http://localhost:3055/v1/api/').then((res) => {
            if (res == false) {
                setValid(false)
            } else {
                setValid(true)
            }
        })

        fetch(`http://localhost:3055/v1/api/read-book/${filename}`, {
            method: 'get',
            credentials: 'include'
        }).then((res) => {
            return res.arrayBuffer()
        }).then((data) => {
            setBuffer(data)
        }).catch((err) => {

        })
    
        // Dọn dẹp sự kiện khi component unmount
        return () => {
            // clearInterval(checkdev)
            window.removeEventListener('keydown', handleKeyDown);
          };

    }, [])



    if (isValid == null) {
        <p>Loading...</p>

    } else {
        if (isValid) {
            return (
                <div>
                    { buffer ? <PDFViewer buffer={ buffer } bookId={ bookId } /> : <p>Loading PDF...</p> }
                </div>
            )

        } else {
            // return <p>Loading...</p>

            navigate('/access')
        }
    }
}
