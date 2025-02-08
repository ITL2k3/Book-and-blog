import Login from '../Login/Login'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'
import { Link } from 'react-router-dom';


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
    //set reference Doc 
    const [referenceDoc, setReferenceDoc] = useState(null)
    //set suggest Doc
    const [suggestDoc, setSuggestDoc] = useState(null)
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

            const categories = finalRes.metadata.categories


            //fetch reference doc 
            fetch(`http://${host}:3055/v1/api/references-doc?categories=${categories}&book_id=${finalRes.metadata.book_id}`, {
                method: 'get',
                credentials: 'include',

            }).then(async (res) => {
                const messageText = await res.text()

                const finalRes = JSON.parse(messageText)
                console.log(finalRes);

                setReferenceDoc(finalRes.metadata)
            })

            fetch(`http://${host}:3055/v1/api/suggest-docs?book_id=${finalRes.metadata.book_id}`, {
                method: 'get',
                credentials: 'include',

            }).then(async (res) => {
                const messageText = await res.text()

                const finalRes = JSON.parse(messageText)
                console.log(finalRes);

                setSuggestDoc(finalRes.metadata)
            })



        }).catch(err => {
            console.log(err);
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
                    <>

                        <div className="bookDetail">
                            <div className="img-container">
                                <img src={ data.thumbnail } alt="" />
                            </div>
                            <div className="book-text">
                                <h2>{ data.title }</h2>
                                <h5>Tác giả: <span id="author">{ data.author }</span></h5>
                                <h5 id="cate">Thể loại: { data.categories.join(', ') }</h5>
                                <h5 id="cate">Lượt đọc: { data.num_of_views / 2 }</h5>
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

                            <div className="referenc-Doc">
                                <h3>Tài liệu đề xuất</h3>
                                <div className="ref-Doc-body">
                                    { suggestDoc && suggestDoc.length > 0 ? (
                                        suggestDoc.map((doc) => (
                                            <div key={ doc.book_id } className="reference-item">
                                                <div className="ref-doc-img">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z" /><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z" /><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z" /><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z" /><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892" /><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035" /><path fill="#909090" d="M23.954 2.077V7.95h5.633z" /><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z" /><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892" /></svg>                                                </div>
                                                <div className="ref-doc-info">
                                                    
                                                    <a  href={ `/detail/${doc._source.title}_${doc._id}`}><b >{ doc._source.title }</b></a>
                                                    
                                                    
                                                    <br />
                                                    <p>{ doc._source.author }</p>
                                                    
                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="6" height="14" x="1" y="4" fill="currentColor"><animate id="svgSpinnersBarsScaleFade0" fill="freeze" attributeName="y" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="1;5"/><animate fill="freeze" attributeName="height" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="22;14"/><animate fill="freeze" attributeName="opacity" begin="0;svgSpinnersBarsScaleFade1.end-0.25s" dur="0.75s" values="1;0.2"/></rect><rect width="6" height="14" x="9" y="4" fill="currentColor" opacity="0.4"><animate fill="freeze" attributeName="y" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s" values="1;5"/><animate fill="freeze" attributeName="height" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s" values="22;14"/><animate fill="freeze" attributeName="opacity" begin="svgSpinnersBarsScaleFade0.begin+0.15s" dur="0.75s" values="1;0.2"/></rect><rect width="6" height="14" x="17" y="4" fill="currentColor" opacity="0.3"><animate id="svgSpinnersBarsScaleFade1" fill="freeze" attributeName="y" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="1;5"/><animate fill="freeze" attributeName="height" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="22;14"/><animate fill="freeze" attributeName="opacity" begin="svgSpinnersBarsScaleFade0.begin+0.3s" dur="0.75s" values="1;0.2"/></rect></svg></p>
                                    ) }
                                </div>

                            </div>

                            <div className="referenc-Doc">
                                <h3>Tài liệu cùng thể loại</h3>
                                <div className="ref-Doc-body">
                                    { referenceDoc && referenceDoc.length > 0 ? (
                                        referenceDoc.map((doc) => (
                                            <div key={ doc.book_id } className="reference-item">
                                                <div className="ref-doc-img">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z" /><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z" /><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z" /><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z" /><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892" /><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035" /><path fill="#909090" d="M23.954 2.077V7.95h5.633z" /><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z" /><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892" /></svg>                                                </div>
                                                <div className="ref-doc-info">
                                                    
                                                    <a  href={ `/detail/${doc.title}_${doc.book_id}`}><b >{ doc.title }</b></a>
                                                    
                                                    
                                                    <br />
                                                    <p>{ doc.author }</p>
                                                    
                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <p>Không có tài liệu liên quan nào.</p>
                                    ) }
                                </div>

                            </div>


                            { isModalOpen && (
                                <div className="tb-overlay">
                                    <div className="Modal-tb">
                                        <div className="Nav-TB">
                                            <h2>Thông báo</h2>
                                            <button onClick={ (event) => { setIsModalOpen(false) } }>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg></button>

                                        </div>
                                        <p>{ insideText }</p>
                                    </div>
                                </div>) }

                        </div>



                    </>

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
