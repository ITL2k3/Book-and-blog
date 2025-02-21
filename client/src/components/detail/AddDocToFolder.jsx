import { useEffect, useState } from "react";
import { host } from "../../host";

export default function Folder({ bookId, setIsAddDocToFolderModalOpen }) {
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [statusCodeAddPdf,setStatusCodeAddPdf] = useState('')
    const [ isModalWarningPdfOpen, setIsModalWarningPdfOpen ] = useState(false)
    useEffect(() => {
        fetch(`http://${host}:3055/v1/api/get-folder`, {
            method: "GET",
            credentials: "include"
        })
            .then(async (res) => {
                const result = await res.json();
                setFolders(result.metadata);
            });
    }, []);

    const handleChosenFolder = (folderId) => {
        console.log(folderId);
        setSelectedFolderId(folderId);
    };

    const handleAddPdfToDoc = async () => {
        try {
            const response = await fetch(`http://${host}:3055/v1/api/add-doc-to-folder`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ folderId: selectedFolderId, bookId })
            });
            const result = await response.json();

            setStatusCodeAddPdf(result.statusCode)
           
            //mở modal thông báo
            setIsModalWarningPdfOpen(true)
            // setIsAddDocToFolderModalOpen(false)
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    }

    return (
        <>
            <div className="tb-overlay">
                <div className="modal3">
                    <div className="modal-content3">
                        <h3>Thư mục</h3>
                        <div className="folder-ctn-detail">
                            { folders.length > 0 && folders.map(folder => (
                                <div
                                    key={ folder.folder_id }
                                    className={ `folder-item-detail ${selectedFolderId === folder.folder_id ? 'selected' : ''}` }
                                    onClick={ () => handleChosenFolder(folder.folder_id) }
                                >
                                    { folder.is_loved_folder === 1 ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="rgb(103, 103, 103)" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm8.6-3.3l2.3-1.75l2.3 1.75l-.85-2.85l2.3-1.85H15.8l-.9-2.8L14 12h-2.85l2.3 1.85z" />
                                        </svg>
                                    ) : folder.is_root_folder === 1 ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="rgb(103, 103, 103)" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z" />
                                        </svg>
                                    ) : folder.is_shared_folder === 1 ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="rgb(103, 103, 103)" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm7-3h8v-.55q0-1.125-1.1-1.787T15 14t-2.9.663T11 16.45zm4-4q.825 0 1.413-.587T17 11t-.587-1.412T15 9t-1.412.588T13 11t.588 1.413T15 13" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#ffd100" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z" />
                                        </svg>
                                    ) }
                                    { folder.name }
                                </div>
                            )) }
                        </div>
                        <div className="btn-md-ctn" style={ { marginTop: '15px', } }>
                            <button onClick={ () => {

                                setIsAddDocToFolderModalOpen(false)

                            } }>Hủy</button>
                            <button onClick={handleAddPdfToDoc}>Thêm</button>
                        </div>
                    </div>
                </div>
            </div>

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
        </>
    );
}
