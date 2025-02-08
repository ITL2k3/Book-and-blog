import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { Form, NavLink, Outlet, useActionData } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'
import { host } from '../../host'
import Cookies from 'js-cookie';
import './insert.css';
import axios from 'axios'

export default function Insert() {
    const actionData = useActionData()
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null); // Tạo ref cho input file

    const [uploadButtonText, setUploadButtonText] = useState('Upload');

    const [isUploading, setIsUploading] = useState(false);


    useEffect(() => {

        checkAuth(`http://${host}:3055/v1/api/`).then((res) => {
            if (res == false) {
                window.location.href = "/access"
            } else {

                setValid(true)
                setData(res)
            }
        })
    }, [])


    useEffect(() => {
        if (actionData) {
            if (actionData.error) {
                setUploadButtonText('reload');
                setIsUploading(false);
            } else if (actionData.success) {
                setUploadButtonText('success');
            }
        }
    }, [actionData]);

    const handleSubmit = (event) => {

        setUploadButtonText('loading');
        setIsUploading(true);
    };



    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
            setFile(droppedFiles[0]);
            fileInputRef.current.files = droppedFiles; // Cập nhật input file
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleChangeFile = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleRemoveFile = () => {
        setFile(null); // Xóa file đã chọn
        fileInputRef.current.value = ''; // Đặt lại giá trị input file
    };


    if (isValid == null) {
        <p>Loading...</p>

    } else {
        if (isValid) {
            return (
                <div className='insert'>
                    <br />
                    <h3>Đăng tải tài liệu </h3>
                    <Form method='post' action="/insert-book" encType='multipart/form-data' onSubmit={ handleSubmit }>
                        <div
                            className={ file ? "drop-zone enable-file-drop" : "drop-zone" }
                            onDrop={ handleDrop }
                            onDragOver={ handleDragOver }

                        >
                            { file ? (
                                <>
                                    <p> <button id="deleteFile" onClick={ handleRemoveFile }><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.039 8H18l-4-4v2.962q0 .44.299.739t.74.299M18 18.79l-1.766 1.74q-.14.141-.331.135q-.191-.007-.337-.153q-.141-.14-.141-.345q0-.203.14-.344l1.747-1.746l-1.766-1.765q-.14-.14-.13-.345q.009-.203.15-.344t.343-.14q.204 0 .345.14L18 17.389l1.766-1.766q.14-.14.34-.133t.348.152q.14.14.14.335t-.14.335l-1.74 1.765l1.74 1.765q.14.14.133.342q-.006.2-.153.347q-.14.14-.334.14t-.334-.14zM6.616 21q-.691 0-1.153-.462T5 19.385V4.615q0-.69.463-1.152T6.616 3h7.213q.323 0 .628.13t.522.349L18.52 7.02q.217.218.348.522t.131.628v3.552q0 .243-.18.389t-.422.129q-1.283-.095-2.464.32q-1.18.416-2.107 1.343q-.8.8-1.256 1.859t-.456 2.289q0 .475.089.998q.088.523.265 1q.129.348-.052.649T11.89 21z" /></svg></button> { file.name }</p>

                                </>


                            ) : (
                                <p>Kéo và thả file PDF vào đây </p>
                            ) }
                            <input
                                type='file'
                                accept=".pdf"
                                name='pdf'
                                required
                                onChange={ handleChangeFile }
                                ref={ fileInputRef } // Gán ref cho input file
                                style={ { display: 'none' } } // Ẩn input file gốc
                            />
                        </div>
                        <div className="Form-container-info">

                            <div className="Form-info-01">

                                <span>Tiêu đề: </span>
                                <br />
                                <input className="inputTE" type='text' name='title' required />
                                <br />

                                <span>Tác giả: </span>
                                <br />
                                <input className="inputTE" type='text' name='author' required />
                                <br />
                                <span>link Ảnh: </span>
                                <br />
                                <input className='inputTE' type='text' name='thumbnail' />

                                <div className="categories">
                                    <span>Thể loại: </span><br />
                                    <div className="checkbox-container-categories">
                                        <div>
                                            <input type='checkbox' name='categories01' value='kns' id='category01' />
                                            <label htmlFor='category01'>Kỹ năng sống</label> <br />
                                            <input type='checkbox' name='categories02' value='kt' id='category02' />
                                            <label htmlFor='category02'>Kinh tế</label> <br />
                                            <input type='checkbox' name='categories03' value='tc' id='category03' />
                                            <label htmlFor='category03'>Tài chính</label> <br />
                                            <input type='checkbox' name='categories04' value='cn' id='category04' />
                                            <label htmlFor='category04'>Công nghệ</label> <br />
                                        </div>
                                        <div>
                                            <input type='checkbox' name='categories05' value='nn' id='category05' />
                                            <label htmlFor='category05'>Ngoại ngữ</label> <br />
                                            <input type='checkbox' name='categories06' value='dc' id='category06' />
                                            <label htmlFor='category06'>Đề cương</label> <br />
                                            <input type='checkbox' name='categories07' value='gt' id='category07' />
                                            <label htmlFor='category07'>Giáo trình</label> <br />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="Form-info-02">

                                <span>Mô tả:</span>
                                <br />
                                <textarea name='description' rows="5" ></textarea> {/* Changed from input to textarea */ }





                                <br />
                                <div style={ { marginTop: "8px" } }>

                                    <span>bạn muốn tài liệu của bạn: </span><br />
                                    <input type='radio' name='isPublic' id='public' value="true" />
                                    <label htmlFor='public'>Công khai</label> <br />
                                    <input type='radio' name='isPublic' id='nopublic' value="false" defaultChecked />
                                    <label htmlFor='nopublic'>Riêng tư</label> <br />
                                </div>


                                <br />


                            </div>
                        </div>


                        <div className="insert-btn-cotainer">


                            <button className={ (uploadButtonText == 'success') ? "upload-btn diss" : "upload-btn" } disabled={ isUploading }>

                                { (uploadButtonText == 'Upload') ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20zm5-12.15L9.125 9.725q-.3.3-.712.288T7.7 9.7q-.275-.3-.288-.7t.288-.7l3.6-3.6q.15-.15.325-.212T12 4.425t.375.063t.325.212l3.6 3.6q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L13 7.85V15q0 .425-.288.713T12 16t-.712-.288T11 15z" /></svg>
                                    : (uploadButtonText == 'loading') ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="3"><animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150" /><animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0;-16;-59;-59" /></circle><animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" /></g></svg>
                                        : (uploadButtonText == 'reload') ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="0" fill="currentColor"><animate fill="freeze" attributeName="r" begin="0.8s" dur="0.2s" values="0;2" /></circle><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="48" stroke-dashoffset="48" d="M4.25 14c0.89 3.45 4.02 6 7.75 6c4.42 0 8 -3.58 8 -8c0 -4.42 -3.58 -8 -8 -8c-2.39 0 -4.53 1.05 -6 2.71l-2 2.29"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0" /></path><path fill="currentColor" stroke-width="1" d="M5.63 7.38l0 0l0 0l0 0z" opacity="0"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M5.63 7.38l0 0l0 0l0 0z;M5.63 7.38L3.5 5.25L3.5 9.5L7.75 9.5z" /><set fill="freeze" attributeName="opacity" begin="0.6s" to="1" /></path></g></svg>
                                            : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><mask id="lineMdCheckAll0"><g fill="none" stroke="#fff" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M2 13.5l4 4l10.75 -10.75"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0" /></path><path stroke="#000" stroke-width="6" d="M7.5 13.5l4 4l10.75 -10.75"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="24;0" /></path><path d="M7.5 13.5l4 4l10.75 -10.75"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="24;0" /></path></g></mask><rect width="24" height="24" fill="currentColor" mask="url(#lineMdCheckAll0)" /></svg> }
                            </button>
                        </div>

                        <div className="actionMEssage-container">
                            
                            { actionData && actionData.error && <p style = {{color: "red"}}><b>{ actionData.error }</b></p> }
                            { actionData && actionData.success && <p style = {{color: "green"}}>{ actionData.success } </p> }
                        </div>

                    </Form>



                </div>
            )



        } else {
            // return <p>Loading...</p>
            return <p>Forbidden !!</p>
        }
    }

}




export const insertAction = async ({ request }) => {
    console.log('hello');
    const formData = await request.formData()

    const categories = [
        formData.get('categories01'),
        formData.get('categories02'),
        formData.get('categories03'),
        formData.get('categories04'),
        formData.get('categories05'),
        formData.get('categories06'),
        formData.get('categories07')
    ];

    // Kiểm tra nếu tất cả giá trị đều null
    if (categories.every(category => category === null)) {
        return {
            error: "Phải chọn ít nhất 1 thể loại!"
        };
    }
    // Kiểm tra loại file
    if (formData.get('pdf').type != 'application/pdf') {
        return {
            error: "Tài liệu đăng tải phải thuộc dạng pdf!"
        }
    }
    const payload = new FormData()

    payload.append("title", formData.get('title'))
    payload.append("author", formData.get('author'))
    payload.append("kns", formData.get('categories01'))
    payload.append("kt", formData.get('categories02'))
    payload.append("tc", formData.get('categories03'))
    payload.append("cn", formData.get('categories04'))
    payload.append("nn", formData.get('categories05'))
    payload.append("dc", formData.get('categories06'))
    payload.append("gt", formData.get('categories07'))

    payload.append("description", formData.get('description'))
    payload.append("isPublic", formData.get('isPublic'))
    payload.append("pdf", formData.get('pdf'))

    if (!formData.get('thumbnail')) {
        payload.append("thumbnail", "https://play-lh.googleusercontent.com/1EgLFchHT9oQb3KME8rzIab7LrOIBfC14DSfcK_Uzo4vuK-WYFs9dhI-1kDI7J0ZNTDr")
    } else {
        payload.append("thumbnail", formData.get('thumbnail'))
    }


    // Tạo form data để gửi tệp PDF
    const formData2 = new FormData();
    formData2.append("file", formData.get('pdf'));

    const options = {
        headers: {
            "x-api-key": "sec_jrP8IC3O6fPFk3wZMi0UNdSShrYXcEut",

        },
    };


    const response = await axios.post("https://api.chatpdf.com/v1/sources/add-file", formData2, options)
    payload.append("source_id_chatPDF", response.data.sourceId)



    const URL = `http://${host}:3055/v1/api/user/post-book`

    //
    let res = await fetch(URL, {
        method: "POST",
        body: payload,

        credentials: 'include'
    })
    console.log(res);
    res = await res.text()
    const data = await JSON.parse(res)

    console.log(data);
    if (data.statusCode == 201) {
        // setTimeout(() => {
        //     window.location.reload()
        // }, 2000)
        return {
            success: "Thêm sách thành công!"
        }
    } else if (data.statusCode == 401) {

        window.location.reload()
    } else if (data.statusCode == 400) {
        return {
            error: data.message
        }
    }
    else {
        return {
            error: "Sai format dữ liệu, đề nghị xem lại file Ảnh hoặc file sách!"
        }
    }

    //append formdata



}