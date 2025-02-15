import React, { useEffect, useState, useRef } from 'react';
import { host } from '../../host.js';
import { useNavigate } from 'react-router-dom';

const MyLibrary = () => {
    const [folders, setFolders] = useState([]);
    const [currentPath, setCurrentPath] = useState('Drive');
    const [files, setFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // Vị trí modal

    const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
    //pdf id and folderid 
    const [isAddPdfModalOpen, setIsAddPdfModalOpen] = useState(false)
    const [pdfIdToAdd, setPPdfIdToAdd] = useState('')
    const [folderId, setFolderId] = useState('')
    //
    const [isModalFolderOpen, setIsModalFolderOpen] = useState(false)
    const [newFolderName, setNewFolderName] = useState('');
    const modalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            refreshFolder()
        };

        fetchData();
    }, []);

    const refreshFolder = async () => {
        try {
            const response = await fetch(`http://${host}:3055/v1/api/get-folder`, {
                method: "GET",
                credentials: "include"
            });
            const result = await response.json();
            console.log(result);
            setFolders(result.metadata);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleFolderClick = async (folderId, folderName) => {
        setCurrentPath(`Drive > ${folderName}`);

        try {
            const response = await fetch(`http://${host}:3055/v1/api/get-doc-from-folder/${folderId}`, {
                method: "GET",
                credentials: "include"
            });
            const result = await response.json();
            setFiles(result.metadata);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleAddFolder = async () => {
        setIsAddFolderModalOpen(true);
    }

    const handleAddPdfModal = async () => {
        setIsAddPdfModalOpen(true)
    }

    const handleCreateFolder = async () => {
        if (!newFolderName) return; // Kiểm tra nếu tên thư mục không rỗng

        try {
            const response = await fetch(`http://${host}:3055/v1/api/add-folder`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ nameFolder: newFolderName })
            });
            const result = await response.json();

            // Cập nhật danh sách thư mục
            setFolders([...folders, result.metadata]);
            setNewFolderName(''); // Đặt lại tên thư mục
            setIsAddFolderModalOpen(false); // Đóng modal
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };


    const handleAddPdf = async () => {
        console.log(folderId, pdfIdToAdd);
        try {
            const response = await fetch(`http://${host}:3055/v1/api/add-doc-to-folder`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ folderId, bookId: pdfIdToAdd})
            });
            const result = await response.json();
            setFolderId(null)
            setPPdfIdToAdd(null)
            // Cập nhật danh sách thư mục
           
            setIsAddPdfModalOpen(false); // Đóng modal
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };


    const handleBackClick = () => {
        setCurrentPath('Drive');
        setFiles([]);
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

    const handleIconFolderClick = (event, folderId) => {
        event.stopPropagation();

        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({
            top: `${(rect.bottom + window.scrollY) / window.innerHeight * 100}%`, // Tính toán top theo phần trăm chiều cao
            left: `${(rect.left + window.scrollX) / window.innerWidth * 100}%` // Tính toán left theo phần trăm chiều rộng
        });
        setFolderId(folderId)
        setIsModalFolderOpen(!isModalFolderOpen);
    }

    
 
    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsModalOpen(false);
            setIsModalFolderOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="myLibrary-container">
            <div className="folder-header-container">
                <h3>{ currentPath }</h3>
                <div>
                    <button id="backward-folder-btn" onClick={ handleBackClick }><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z" /></svg></button>
                    <button id="backward-folder-btn" onClick={ refreshFolder }><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44c-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71z" /></svg></button>
                </div>

            </div>
            <button id="add-folder-btn" onClick={ handleAddFolder }><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2m-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3z" /></svg> Thêm</button>
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

            <div className="folder-list">
                { currentPath === 'Drive' ? (
                    folders.map((folder) => (
                        <div key={ folder.folder_id } className="folder-item" onClick={ () => handleFolderClick(folder.folder_id, folder.name) }>
                            <div className="folder-column">
                                { (folder.is_loved_folder == 1) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgb(103, 103, 103)" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm8.6-3.3l2.3-1.75l2.3 1.75l-.85-2.85l2.3-1.85H15.8l-.9-2.8L14 12h-2.85l2.3 1.85z" /></svg>
                                    : (folder.is_root_folder == 1) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgb(103, 103, 103)" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z" /></svg>
                                        : (folder.is_shared_folder == 1) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgb(103, 103, 103)" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm7-3h8v-.55q0-1.125-1.1-1.787T15 14t-2.9.663T11 16.45zm4-4q.825 0 1.413-.587T17 11t-.587-1.412T15 9t-1.412.588T13 11t.588 1.413T15 13" /></svg>
                                            : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffd100" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z" /></svg> }
                                { folder.name }</div>
                            <div className="folder-column">Tôi</div>
                            <div className="folder-column">{ new Date(folder.last_update).toLocaleString() }</div>
                            <div className="folder-column" onClick={ (e) => handleIconFolderClick(e, folder.folder_id) }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
                                </svg>
                            </div>
                        </div>
                    ))
                ) : (
                    <></>
                ) }
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

            {/* Modal for folder */ }
            { isModalFolderOpen && (
                <div className="modal2" ref={ modalRef } style={ { top: modalPosition.top, left: modalPosition.left } }>
                    <div className="modal-content2">

                        <div onClick = {handleAddPdfModal} > <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="M19 11c.17 0 .33.01.49.02L15 3H9l5.68 9.84A6 6 0 0 1 19 11M8.15 4.52L2 15.5L5 21l6.33-10.97zM13.2 15.5H9.9L6.73 21h7.81A5.93 5.93 0 0 1 13 17c0-.52.07-1.02.2-1.5m6.8.5v-3h-2v3h-3v2h3v3h2v-3h3v-2z" /></svg>
                            Thêm tài liệu</div>
                        <div> <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="m15 16l-4 4h10v-4zm-2.94-8.81L3 16.25V20h3.75l9.06-9.06zM5.92 18H5v-.92l7.06-7.06l.92.92zm12.79-9.96a.996.996 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z" /></svg>
                            Đổi tên</div>
                        <div> <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                            Xóa</div>
                    </div>
                </div>
            ) }

            {/* Modal for pdf */ }
            { isModalOpen && (
                <div className="modal2" ref={ modalRef } style={ { top: modalPosition.top, left: modalPosition.left } }>
                    <div className="modal-content2">
                        <div>Chia sẻ</div>
                        <div>Xóa khỏi thư mục</div>
                    </div>
                </div>
            ) }


            {/* add pdf to folder */ }

            { isAddPdfModalOpen && (
                <div className="modal-add-ovl">
                    <div className="modal3"  style={ { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }>
                        <div className="modal-content3">
                            <h4>Nhập Id tài liệu </h4>
                            <input
                                type="text"
                                value={ pdfIdToAdd}
                                onChange={ (e) => setPPdfIdToAdd(e.target.value) }
                                placeholder="id tài liệu"
                            />
                            <div className="btn-md-ctn">
                                <button onClick={ () => {
                                    setIsAddPdfModalOpen(false);  
                                    setFolderId(null)
                                    setPPdfIdToAdd(null)} }>Hủy</button>
                                <button onClick={ handleAddPdf }>Thêm</button>
                            </div>


                        </div>
                    </div>
                </div>

            ) }
            {/* add folder */ }
            { isAddFolderModalOpen && (
                <div className="modal-add-ovl">
                    <div className="modal3" ref={ modalRef } style={ { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }>
                        <div className="modal-content3">
                            <h4>Nhập tên thư mục </h4>
                            <input
                                type="text"
                                value={ newFolderName }
                                onChange={ (e) => setNewFolderName(e.target.value) }
                                placeholder="tên thư mục"
                            />
                            <div className="btn-md-ctn">
                                <button onClick={ () => setIsAddFolderModalOpen(false) }>Hủy</button>
                                <button onClick={ handleCreateFolder }>Tạo</button>
                            </div>


                        </div>
                    </div>
                </div>

            ) }
        </div>
    );
};

export default MyLibrary;
