import React, { useEffect, useState, useRef } from 'react';
import { host } from '../../host.js';
import { useNavigate, Form, Link, NavLink, Outlet, useActionData } from 'react-router-dom';
import SmallSearchBar from './smallsearchbar.jsx';
const Upload = () => {
    const [modalContent, setModalContent] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // Vị trí modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);

    const [files, setFiles] = useState([])

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [dataForm, setDataForm] = useState(null)
    const actionData = useActionData()
    //share
    const [destUserId, setDestUserId] = useState('')
    const [isSharePdfModalOpen, setIsSharePdfModalOpen] = useState(false)
    const [isModalWarningSharePdfOpen, setIsModalWarningSharePdfOpen] = useState(false)
    const [statusCodeAddPdf, setStatusCodeAddPdf] = useState(null)


    const navigate = useNavigate()


    const [data, setData] = useState(null)
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null); // Tạo ref cho input file

    const [uploadButtonText, setUploadButtonText] = useState('Upload');

    const [isUploading, setIsUploading] = useState(false);
    useEffect(() => {
        refreshFile()

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

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
    const handleSubmitbtn = (event) => {
        setUploadButtonText('loading');
        setIsUploading(true);
    };

    const handleUpdateClick = () => {
        setIsFormVisible(true)
    }


    const handleSharePdf = async () => {
        
        try {
            const response = await fetch(`http://${host}:3055/v1/api/share-doc`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ bookId: modalContent.book_id, destUserId })
            });
            const result = await response.json();
            console.log(result);
            setStatusCodeAddPdf(result.statusCode)
        


            //mở modal thông báo
            setIsModalWarningSharePdfOpen(true)
            setIsSharePdfModalOpen(false) // Đóng modal
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };


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



    const refreshFile = async () => {
        fetch(`http://${host}:3055/v1/api/user/get-book`, {
            method: 'get',
            credentials: 'include'
        }).then(async (res) => {
            console.log(res);
            const messageText = await res.text()

            const finalRes = JSON.parse(messageText)
            setFiles(finalRes.metadata.results)
        })

    }
    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsModalOpen(false);

        }
    };


    const handleIconClick = (event, file) => {
        event.stopPropagation();
        setModalContent(file);

        // Tính toán vị trí của modal dựa trên vị trí của icon
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({
            top: `${(rect.bottom + window.scrollY) / window.innerHeight * 100}%`, // Tính toán top theo phần trăm chiều cao
            left: `${(rect.left + window.scrollX) / window.innerWidth * 100}%` // Tính toán left theo phần trăm chiều rộng
        });
        setIsModalOpen(!isModalOpen);
    };


    const handleDeleteFile = async () => {
        fetch(`http://${host}:3055/v1/api/user/delete-book?file=${modalContent.filepath}&book_id=${modalContent.book_id}&src_id=${modalContent.source_id_chatPDF}`, {
            method: 'delete',
            credentials: 'include'
        }).then((res) => {
            console.log(res);
            refreshFile()
            setIsModalOpen(false)
            // window.location.reload()
        })
    }
    return (
        <div className="myLibrary-container">
            <div className="folder-header-container">
                <h3>Tài liệu đăng tải</h3>
                <div>
                    <button onClick={ refreshFile } id="backward-folder-btn" ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44c-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71z" /></svg></button>
                </div>

            </div>
            <SmallSearchBar setF={ setFiles } />
            <div className="folder-header">
                <div className="folder-column">Tên</div>
                <div className="folder-column">Tác giả </div>
                <div className="folder-column">Cập nhật lần cuối</div>
                <div className="folder-column">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
                    </svg>
                </div>
            </div>



            { files.length > 0 && (
                <div>
                    <div className="folder-list">
                        { files.map((file) => (
                            <div key={ file.book_id } className="folder-item" onClick={ () => { navigate(`/detail/${file.title}_${file.book_id}`); } }>
                                <div className="folder-column"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#f00" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-9.5 8.5c0 .8-.7 1.5-1.5 1.5H7v2H5.5V9H8c.8 0 1.5.7 1.5 1.5zm5 2c0 .8-.7 1.5-1.5 1.5h-2.5V9H13c.8 0 1.5.7 1.5 1.5zm4-3H17v1h1.5V13H17v2h-1.5V9h3zm-6.5 0h1v3h-1zm-5 0h1v1H7z" /></svg>
                                    { file.title }</div>
                                <div className="folder-column">{ file.author }</div>
                                <div className="folder-column">{ new Date(file.last_update).toLocaleString() }</div>
                                <div className="folder-column" onClick={ (e) => handleIconClick(e, file) }>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
                                    </svg>
                                </div>
                            </div>
                        )) }
                    </div>
                </div>
            ) }




            {/* share pdf modal */ }
            { isSharePdfModalOpen && (
                <div className="modal-add-ovl">
                    <div className="modal3" style={ { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }>
                        <div className="modal-content3">
                            <h4>Nhập Id người dùng </h4>
                            <input
                                type="text"
                                value={ destUserId }
                                onChange={ (e) => setDestUserId(e.target.value) }
                                placeholder="Id người dùng "
                            />
                            <div className="btn-md-ctn">
                                <button onClick={ () => {
                                    setIsSharePdfModalOpen(false);


                                } }>Hủy</button>
                                <button onClick={ handleSharePdf }>Thêm</button>
                            </div>


                        </div>
                    </div>
                </div>

            ) }

            {/* warning share folder */ }
            { isModalWarningSharePdfOpen && (
                <div className="tb-overlay">
                    <div className="Modal-tb">
                        <div className="Nav-TB">
                            <h2>Thông báo</h2>
                            <button onClick={ (event) => { setIsModalWarningSharePdfOpen(false) } }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg></button>

                        </div>
                        <p>
                            { statusCodeAddPdf == 200 ? "Chia sẻ tài liệu thành công" :
                                statusCodeAddPdf == 400 ? "Tài liệu không tồn tại!" :
                                    statusCodeAddPdf == 400.1 ? "Người dùng không tồn tại!" :
                                        "Tài liệu đã ở trong folder của người dùng"

                            }
                        </p>
                    </div>
                </div>) }


            {/* modal for custome file */ }
            { isModalOpen && (
                <div className="modal2" ref={ modalRef } style={ { top: modalPosition.top, left: modalPosition.left } }>
                    <div className="modal-content2">
                        <div onClick={ handleUpdateClick } > <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 2c-.53 0-1.04.21-1.41.59C4.21 2.96 4 3.47 4 4v16c0 .53.21 1.04.59 1.41c.37.38.88.59 1.41.59h7c-.37-.6-.66-1.28-.83-2H6V4h7v5h5v3h.5c.5 0 1 .06 1.5.17V8l-6-6zm6 16c.07-.7.24-1.38.5-2H8v2zm1.81-4c.62-.64 1.36-1.15 2.19-1.5V12H8v2zm4.19.5c1.11 0 2.11.45 2.83 1.17L22 14.5v4h-4l1.77-1.77A2.5 2.5 0 1 0 20 20h1.71A3.99 3.99 0 0 1 18 22.5c-2.21 0-4-1.79-4-4s1.79-4 4-4" /></svg>
                            Cập nhật</div>
                        <div onClick={ () => setIsSharePdfModalOpen(true) } > <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92M18 4c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M6 13c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m12 7.02c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1" /></svg>
                            Chia sẻ</div>

                        <div onClick={ handleDeleteFile }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                            Xóa</div>
                    </div>
                </div>
            ) }

            {/* modal for update form s */ }
            { isFormVisible && (
                <div className="ovl-frm-ctn-update">
                    <div className="form-ctn-update">
                        <h2>Cập nhật tài liệu</h2>
                        <Form method='put' action="/storage" encType='multipart/form-data' onSubmit={ handleSubmitbtn }>
                            <input type="text" name='bookId' value={ modalContent.book_id } style={ { display: 'none' } } />

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

                                    onChange={ handleChangeFile }
                                    ref={ fileInputRef } // Gán ref cho input file
                                    style={ { display: 'none' } } // Ẩn input file gốc
                                />
                            </div>
                            <div className="Form-container-info">

                                <div className="Form-info-01">

                                    <span>Tiêu đề: </span>
                                    <br />
                                    <input className="inputTE" placeholder={ modalContent.title } type='text' name='title' />
                                    <br />

                                    <span>Tác giả: </span>
                                    <br />
                                    <input className="inputTE" placeholder={ modalContent.author } type='text' name='author' />
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
                                    <textarea placeholder={ modalContent.description } name='description' rows="5" ></textarea> {/* Changed from input to textarea */ }





                                    <br />
                                    <div style={ { marginTop: "8px" } }>

                                        <span>bạn muốn tài liệu của bạn: </span><br />
                                        { modalContent.isPublic ? <>
                                            <input type='radio' name='isPublic' id='public' value="true" defaultChecked />
                                            <label for='public'>Công khai</label> <br />
                                            <input type='radio' name='isPublic' id='nopublic' value="false" />
                                            <label for='nopublic'>Riêng tư</label> <br />
                                        </> : <>
                                            <input type='radio' name='isPublic' id='public' value="true" />
                                            <label for='public'>Công khai</label> <br />
                                            <input type='radio' name='isPublic' id='nopublic' value="false" defaultChecked />
                                            <label for='nopublic'>Riêng tư</label> <br />
                                        </> }

                                    </div>


                                    <br />


                                </div>
                            </div>




                            <div className="insert-btn-cotainer">

                                <button className="upload-btn" id="cancle-btn-update" onClick={ () => {
                                    setIsFormVisible(false)
                                } }>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#222" d="m10.6 12l-1.9 1.9q-.275.275-.275.7t.275.7t.7.275t.7-.275l1.9-1.9l1.9 1.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7L13.4 12l1.9-1.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 10.6l-1.9-1.9q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7zM4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20z" /></svg>
                                </button>
                                <button className={ (uploadButtonText == 'success') ? "upload-btn diss" : "upload-btn" } disabled={ isUploading }>

                                    { (uploadButtonText == 'Upload') ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20zm5-12.15L9.125 9.725q-.3.3-.712.288T7.7 9.7q-.275-.3-.288-.7t.288-.7l3.6-3.6q.15-.15.325-.212T12 4.425t.375.063t.325.212l3.6 3.6q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L13 7.85V15q0 .425-.288.713T12 16t-.712-.288T11 15z" /></svg>
                                        : (uploadButtonText == 'loading') ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="3"><animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150" /><animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0;-16;-59;-59" /></circle><animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" /></g></svg>
                                            : (uploadButtonText == 'reload') ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="0" fill="currentColor"><animate fill="freeze" attributeName="r" begin="0.8s" dur="0.2s" values="0;2" /></circle><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="48" stroke-dashoffset="48" d="M4.25 14c0.89 3.45 4.02 6 7.75 6c4.42 0 8 -3.58 8 -8c0 -4.42 -3.58 -8 -8 -8c-2.39 0 -4.53 1.05 -6 2.71l-2 2.29"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0" /></path><path fill="currentColor" stroke-width="1" d="M5.63 7.38l0 0l0 0l0 0z" opacity="0"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M5.63 7.38l0 0l0 0l0 0z;M5.63 7.38L3.5 5.25L3.5 9.5L7.75 9.5z" /><set fill="freeze" attributeName="opacity" begin="0.6s" to="1" /></path></g></svg>
                                                : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><mask id="lineMdCheckAll0"><g fill="none" stroke="#fff" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M2 13.5l4 4l10.75 -10.75"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0" /></path><path stroke="#000" stroke-width="6" d="M7.5 13.5l4 4l10.75 -10.75"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="24;0" /></path><path d="M7.5 13.5l4 4l10.75 -10.75"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="24;0" /></path></g></mask><rect width="24" height="24" fill="currentColor" mask="url(#lineMdCheckAll0)" /></svg> }
                                </button>
                            </div>


                            <div className="actionMEssage-container">

                                { actionData && actionData.error && <p style={ { color: "red" } }><b>{ actionData.error }</b></p> }
                                { actionData && actionData.success && <p style={ { color: "green" } }>{ actionData.success } </p> }
                            </div>

                        </Form>
                    </div>
                </div>


            ) }



        </div>
    );
};



export const updateAction = async ({ request }) => {
    const formData = await request.formData()

    //append formdata
    const payload = new FormData()
    payload.append("bookId", formData.get('bookId'))
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
    payload.append("source_id_chatPDF", formData.get("source_id_chatPDF"))


    if (formData.get('pdf').size) {
        console.log('contain file');
        const formData2 = new FormData();
        formData2.append("file", formData.get('pdf'));

        const options = {
            headers: {
                "x-api-key": "sec_jrP8IC3O6fPFk3wZMi0UNdSShrYXcEut",

            },
        };


        const response = await axios.post("https://api.chatpdf.com/v1/sources/add-file", formData2, options)
        payload.append("source_id_chatPDF_new", response.data.sourceId)

    }
    if (!formData.get('thumbnail')) {
        payload.append("thumbnail", "https://play-lh.googleusercontent.com/1EgLFchHT9oQb3KME8rzIab7LrOIBfC14DSfcK_Uzo4vuK-WYFs9dhI-1kDI7J0ZNTDr")
    } else {
        payload.append("thumbnail", formData.get('thumbnail'))
    }

    const URL = `http://${host}:3055/v1/api/user/update-book`

    let res = await fetch(URL, {
        method: "PUT",
        body: payload,

        credentials: 'include'
    })
    res = await res.text()

    const data = await JSON.parse(res)
    if (data.statusCode == 200) {
        console.log(data.metadata);
        localStorage.removeItem(data.metadata)
        refreshFile()
        return {
            success: "Cập Nhật thành công"
        }
    } else if (data.statusCode == 401) {

        window.location.reload()
    } else if (data.statusCode == 400) {
        return {
            error: data.message
        }
    } else {
        return {
            error: "Sai format dữ liệu, đề nghị xem lại file ảnh hoặc sách."
        }
    }


}
export default Upload;
