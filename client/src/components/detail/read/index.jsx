
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Login from '../../Login/Login';
import checkAuth, { checkDevTool } from '../../../Auth/checkAuth';
import PDFViewer from './pdfviewer';
import ChatPDF from '../../chatPDF';
import { host } from '../../../host';


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



    const [currentPage, setCurrentPage] = useState(''); // State để lưu trang hiện tại


    useEffect(() => {


        // const handleKeyDown = (event) => {
        //     event.preventDefault(); // Ngăn chặn hành động mặc định
        //   };
        //   const handleBeforeUnload = (event) => {
        //     event.preventDefault();
        //     event.returnValue = ''; // Trả về một chuỗi để hiển thị hộp thoại xác nhận
        //   };


        // Thêm sự kiện keydown
        //   window.addEventListener('beforeunload', handleBeforeUnload);

        //   window.addEventListener('keydown', handleKeyDown);


        // const checkdev = setInterval(checkDevTool, 500)


        checkAuth(`http://${host}:3055/v1/api/`).then((res) => {
            if (res == false) {
                setValid(false)
            } else {
                setValid(true)
            }
        })

        fetch(`http://${host}:3055/v1/api/read-book/${filename}_${bookId}`, {
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
            // window.removeEventListener('keydown', handleKeyDown);
            // window.removeEventListener('beforeunload', handleBeforeUnload);

        };

    }, [])

    const selectElement = document.getElementById('page_changed')

    const handlePageChange = (pageNumber) => {

        setCurrentPage(`${pageNumber}`); // Cập nhật nội dung khi nhấp vào trang
        const event = new Event('change');
                selectElement.dispatchEvent(event);
    };

    if (isValid == null) {

        <p>Loading...</p>

    } else {
        if (isValid) {

            return (
                <div className = "page-bounder-read">
                    <p id="current-page"  >{ currentPage }</p> {/* Hiển thị nội dung trang hiện tại */ }
                    <select id="page_changed" >
                        <option value="">--Chọn--</option>
                        <option value="1">Giá trị 1</option>
                        <option value="2">Giá trị 2</option>
                        
                    </select>

                    { buffer ? <PDFViewer buffer={ buffer } bookId={ bookId } onPageChange={ handlePageChange } /> : <p>Loading PDF...</p> }
                    <ChatPDF onPageChange={ handlePageChange } />

                </div>
            )

        } else {
            // return <p>Loading...</p>

            navigate('/access')
        }
    }
}
