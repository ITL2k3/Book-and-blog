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
    const [isModalWarningPdfOpen, setIsModalWarningPdfOpen] = useState(false)
    const [statusCodeAddPdf, setStatusCodeAddPdf] = useState(null)
    //setting folder
    const [isModalFolderOpen, setIsModalFolderOpen] = useState(false)
    //delete folder
    const [deleteFolderQuery, setDeleteFolderQuery] = useState(null)
    const [isModalWarningDeleteFolder, setisModalWarningDeleteFolder] = useState(false)
    //rename folder
    const [isModalRenameFolderOpen, setIsModalRenameFolderOpen] = useState(false)
    const [renameFolder, setRenameFolder] = useState('')
    const [isModalWarningRenameFolder, setisModalWarningRenameFolder] = useState(false)
    //set current folder for delete file
    const [currentFolder, setCurrentFolder] = useState('')
    const [currentPdf, setCurrentPdf] = useState('')
    const [isModalWarningDeletePdfFromFolder, setisModalWarningDeletePdfFromFolder] = useState(false)
    //set share pdf to another account
    const [destUserId, setDestUserId] = useState('')
    const [isSharePdfModalOpen, setIsSharePdfModalOpen] = useState(false)
    const [isModalWarningSharePdfOpen, setIsModalWarningSharePdfOpen] = useState(false)


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
            if (currentPath == 'Drive') {
                const response = await fetch(`http://${host}:3055/v1/api/get-folder`, {
                    method: "GET",
                    credentials: "include"
                });
                const result = await response.json();
                console.log(result);
                setFolders(result.metadata);
            } else {
                const response = await fetch(`http://${host}:3055/v1/api/get-doc-from-folder/${currentFolder}`, {
                    method: "GET",
                    credentials: "include"
                });
                const result = await response.json();
                console.log(result);
                setFiles(result.metadata)
            }

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
            setCurrentFolder(folderId)
            setFolderId(folderId)
            setFiles(result.metadata);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleAdd = async () => {
        if (currentPath == 'Drive') {
            setIsAddFolderModalOpen(true);
        } else {
            setIsAddPdfModalOpen(true)
        }

    }

    const handleAddPdfModal = async () => {
        setIsAddPdfModalOpen(true)
    }

    const handleRenameModal = async () => {
        setIsModalRenameFolderOpen(true)
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
    ///delete-doc-from-folder
    const handleDeleteFolder = async () => {

        try {
            const response = await fetch(`http://${host}:3055/v1/api/delete-folder?${deleteFolderQuery}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",

            });
            const result = await response.json();

            setStatusCodeAddPdf(result.statusCode)
            setisModalWarningDeleteFolder(true)
            // Cập nhật danh sách thư mục
            if (result.statusCode == 200) setFolders(folders.filter(folder => folder.folder_id != folderId))


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
                body: JSON.stringify({ folderId, bookId: pdfIdToAdd })
            });
            const result = await response.json();

            setStatusCodeAddPdf(result.statusCode)
            setPPdfIdToAdd(null)

            refreshFolder()

            //mở modal thông báo
            setIsModalWarningPdfOpen(true)
            setIsAddPdfModalOpen(false); // Đóng modal
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };


    const handleSharePdf = async () => {

        try {
            const response = await fetch(`http://${host}:3055/v1/api/share-doc`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ bookId: currentPdf, destUserId })
            });
            const result = await response.json();
            console.log(result);
            setStatusCodeAddPdf(result.statusCode)
            setCurrentPdf(null)


            //mở modal thông báo
            setIsModalWarningSharePdfOpen(true)
            setIsSharePdfModalOpen(false) // Đóng modal
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };


    const handleDeletePdfFromFolder = async (bookId) => {

        try {
            const response = await fetch(`http://${host}:3055/v1/api/delete-doc-from-folder?folderId=${currentFolder}&bookId=${currentPdf}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",

            });
            const result = await response.json();
            if (result.statusCode == 200) {
                setFiles(files.filter(file => {
                    if (file.book_id != currentPdf) return file
                }))
                setCurrentPdf('')
            }
            console.log(result);
            setStatusCodeAddPdf(result.statusCode)
            setisModalWarningDeletePdfFromFolder(true)
            // // Cập nhật danh sách thư mục


        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };


    const handleRenameFolder = async () => {

        try {
            const response = await fetch(`http://${host}:3055/v1/api/update-name-folder`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ folderId, nameFolder: renameFolder })
            });
            const result = await response.json();

            setStatusCodeAddPdf(result.statusCode)
            console.log(result);
            //mở modal thông báo
            if (result.statusCode == 200) {
                setFolders(folders.map(folder => {
                    if (folder.folder_id == folderId) {
                        return { ...folder, name: renameFolder }
                    }
                    return folder
                }))
            }

            setisModalWarningRenameFolder(true)
            setIsModalRenameFolderOpen(false)
            setRenameFolder(null)
            setFolderId(null)

        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };



    const handleBackClick = () => {
        setCurrentPath('Drive');
        setCurrentFolder('')
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
        setCurrentPdf(file.book_id)
        setIsModalOpen(!isModalOpen);
    };

    const handleIconFolderClick = (event, folderId, isRootFolder, isLovedFolder, isSharedFolder) => {
        event.stopPropagation();

        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({
            top: `${(rect.bottom + window.scrollY) / window.innerHeight * 100}%`, // Tính toán top theo phần trăm chiều cao
            left: `${(rect.left + window.scrollX) / window.innerWidth * 100}%` // Tính toán left theo phần trăm chiều rộng
        });
        setFolderId(folderId)

        setDeleteFolderQuery(`folderId=${folderId}&isLovedFolder=${isLovedFolder}&isRootFolder=${isRootFolder}&isSharedFolder=${isSharedFolder}`)
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
            <button id={ currentPath == 'Drive' ? "add-folder-btn" : "add-pdf-btn" } onClick={ handleAdd }><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2m-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3z" /></svg> Thêm</button>
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
                            <div className="folder-column" onClick={ (e) => handleIconFolderClick(e, folder.folder_id, folder.is_root_folder, folder.is_loved_folder, folder.is_shared_folder) }>
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

                        <div onClick={ handleAddPdfModal }  > <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="M19 11c.17 0 .33.01.49.02L15 3H9l5.68 9.84A6 6 0 0 1 19 11M8.15 4.52L2 15.5L5 21l6.33-10.97zM13.2 15.5H9.9L6.73 21h7.81A5.93 5.93 0 0 1 13 17c0-.52.07-1.02.2-1.5m6.8.5v-3h-2v3h-3v2h3v3h2v-3h3v-2z" /></svg>
                            Thêm tài liệu</div>
                        <div onClick={ handleRenameModal }>

                            <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="m15 16l-4 4h10v-4zm-2.94-8.81L3 16.25V20h3.75l9.06-9.06zM5.92 18H5v-.92l7.06-7.06l.92.92zm12.79-9.96a.996.996 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z" /></svg>
                            Đổi tên</div>
                        <div onClick={ handleDeleteFolder }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                            Xóa</div>
                    </div>
                </div>
            ) }

            {/* Modal for pdf */ }
            { isModalOpen && (
                <div className="modal2" ref={ modalRef } style={ { top: modalPosition.top, left: modalPosition.left } }>
                    <div className="modal-content2">
                        <div onClick={ () => setIsSharePdfModalOpen(true) }  > <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92M18 4c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M6 13c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m12 7.02c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1" /></svg>
                            Chia sẻ</div>

                        <div onClick={ handleDeletePdfFromFolder }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#606060" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                            Xóa</div>
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


            {/* add pdf to folder */ }

            { isAddPdfModalOpen && (
                <div className="modal-add-ovl">
                    <div className="modal3" style={ { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }>
                        <div className="modal-content3">
                            <h4>Nhập Id tài liệu </h4>
                            <input
                                type="text"
                                value={ pdfIdToAdd }
                                onChange={ (e) => setPPdfIdToAdd(e.target.value) }
                                placeholder="id tài liệu"
                            />
                            <div className="btn-md-ctn">
                                <button onClick={ () => {
                                    setIsAddPdfModalOpen(false);
                                    setFolderId(null)
                                    setPPdfIdToAdd(null)
                                } }>Hủy</button>
                                <button onClick={ handleAddPdf }>Thêm</button>
                            </div>


                        </div>
                    </div>
                </div>

            ) }

            {/* rename folder */ }

            { isModalRenameFolderOpen && (
                <div className="modal-add-ovl">
                    <div className="modal3" style={ { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }>
                        <div className="modal-content3">
                            <h4>Nhập tên tài liệu </h4>
                            <input
                                type="text"
                                value={ renameFolder }
                                onChange={ (e) => setRenameFolder(e.target.value) }
                                placeholder="tên muốn chỉnh sửa"
                            />
                            <div className="btn-md-ctn">
                                <button onClick={ () => {
                                    setIsModalRenameFolderOpen(false);
                                    setFolderId(null)
                                    setRenameFolder(null)
                                } }>Hủy</button>
                                <button onClick={ handleRenameFolder }>Sửa</button>
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
                                    statusCodeAddPdf == 400.1 ? "Người dùng không tồn tại!":
                                    "Tài liệu đã ở trong folder của người dùng"

                            }
                        </p>
                    </div>
                </div>) }




            {/* warning pdf to folder */ }
            { isModalWarningPdfOpen && (
                <div className="tb-overlay">
                    <div className="Modal-tb">
                        <div className="Nav-TB">
                            <h2>Thông báo</h2>
                            <button onClick={ (event) => { setIsModalWarningPdfOpen(false) } }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg></button>

                        </div>
                        <p>
                            { statusCodeAddPdf == 200 ? "Thêm tài liệu thành công" :
                                statusCodeAddPdf == 400 ? "Tài liệu không tồn tại!" :
                                    statusCodeAddPdf == 400.1 ? "Thư mục chia sẻ chỉ dùng để nhận tài liệu từ người khác!" :
                                        "Tài liệu đã tồn tại trong folder!"

                            }
                        </p>
                    </div>
                </div>) }

            {/* modal warrning delete folder result */ }
            { isModalWarningDeleteFolder && (
                <div className="tb-overlay">
                    <div className="Modal-tb">
                        <div className="Nav-TB">
                            <h2>Thông báo</h2>
                            <button onClick={ (event) => { setisModalWarningDeleteFolder(false) } }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg></button>

                        </div>
                        <p>
                            { statusCodeAddPdf == 200 ? "Xóa thư mục thành công!" : "Không thể xóa thư mục mặc định!"


                            }
                        </p>
                    </div>
                </div>) }

            {/* modal warrning delete pdf from folder result */ }
            { isModalWarningDeletePdfFromFolder && (
                <div className="tb-overlay">
                    <div className="Modal-tb">
                        <div className="Nav-TB">
                            <h2>Thông báo</h2>
                            <button onClick={ (event) => { setisModalWarningDeletePdfFromFolder(false) } }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg></button>

                        </div>
                        <p>
                            { statusCodeAddPdf == 200 ? "Xóa tài liệu thành công!" : "Lỗi!"


                            }
                        </p>
                    </div>
                </div>) }




            {/* modal warrning rename folder result */ }
            { isModalWarningRenameFolder && (
                <div className="tb-overlay">
                    <div className="Modal-tb">
                        <div className="Nav-TB">
                            <h2>Thông báo</h2>
                            <button onClick={ (event) => { setisModalWarningRenameFolder(false) } }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg></button>

                        </div>
                        <p>
                            { statusCodeAddPdf == 200 ? "Đổi tên thư mục thành công!" : "Không thể đổi tên thư mục mặc định!"


                            }
                        </p>
                    </div>
                </div>) }




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
