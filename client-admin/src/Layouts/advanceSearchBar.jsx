import { build } from 'pdfjs-dist';
import React, { useState } from 'react';
import { host } from '../host';

const AdvancedSearch = ({ setShowAdvancedSearch }) => {
    const [searchPhrase, setSearchPhrase] = useState('');
    const [totalPages, setTotalPages] = useState('');
    const [creationDate, setCreationDate] = useState('');
    const [error, setError] = useState('');
    const [data, setData] = useState('');


    const [queryStringSearch, setQueryString] = useState('')
    const [page, setPage] = useState(1)

    const handleRefresh = () => {
        setData(null)
        setPage(1)
        setSearchPhrase('');
        setTotalPages('');
        setCreationDate('');
        setError('');
    };

    const validateTotalPages = (pages) => {
        if (pages.trim() === '') {
            return ''; // Nếu bỏ trống, không có lỗi
        }
        const pagesPattern = /^\d+-\d+$/;
        if (!pagesPattern.test(pages)) {
            return 'Định dạng tổng số trang không hợp lệ. Vui lòng nhập X-Y (ví dụ: 5-10).';
        }
        return '';
    };

    const validateCreationDate = (date) => {
        if (date.trim() === '') {
            return ''; // Nếu bỏ trống, không có lỗi
        }

        const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}_\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

        if (!datePattern.test(date)) {
            return 'Định dạng ngày tạo không hợp lệ. Vui lòng nhập (ngày tạo)T(giờ tạo)_(ngày tạo)T(giờ tạo) (ví dụ: 2020-01-01T00:00:00_2025-11-11T23:59:59).';
        }

        const [start, end] = date.split('_');
        const [startDate, startTime] = start.split('T');
        const [endDate, endTime] = end.split('T');

        // Kiểm tra định dạng ngày
        const isValidDate = (dateString) => {
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day); // Month is 0-indexed in JS
            return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
        };

        // Kiểm tra định dạng giờ
        const isValidTime = (timeString) => {
            const timePattern = /^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/;
            return timePattern.test(timeString);
        };

        // Kiểm tra ngày và giờ
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return 'Ngày không hợp lệ. Vui lòng kiểm tra lại.';
        }

        if (!isValidTime(startTime) || !isValidTime(endTime)) {
            return 'Giờ không hợp lệ. Vui lòng kiểm tra lại.';
        }

        return ''; // Không có lỗi
    };

    const handleInputChange = (setter, validator) => (e) => {
        const value = e.target.value;
        setter(value);

        // Kiểm tra giá trị đầu vào ngay lập tức
        const validationError = validator(value);
        setError(validationError);
    };


    const buildQueryString = (searchPhrase, totalPages, creationDate) => {
        const params = [];

        if (searchPhrase.trim()) {
            params.push(`content=${encodeURIComponent(searchPhrase)}`);
        }

        if (totalPages.trim()) {
            params.push(`numpages=${totalPages}`);
        }

        if (creationDate.trim()) {
            params.push(`creationdate=${creationDate}`);
        }

        return params.length > 0 ? params.join('&') : '';
    };

    const handleBackwardPage = (e) => {

        e.preventDefault();
        if (!error) {
            let queryString = buildQueryString(searchPhrase, totalPages, creationDate)

            fetch(`http://${host}:3055/v1/api/search-doc-advance?${queryString}&page=${page - 1}`, {
                method: 'get',
                credentials: 'include',

            }).then(async (res) => {
                const messageText = await res.text()
                setPage(page - 1)
                const finalRes = JSON.parse(messageText)
                setData(finalRes)
                console.log(finalRes);


            })
        }


    }

    const handleForwardPage = (e) => {

        e.preventDefault();
        if (!error) {
            let queryString = buildQueryString(searchPhrase, totalPages, creationDate)

            fetch(`http://${host}:3055/v1/api/search-doc-advance?${queryString}&page=${page + 1}`, {
                method: 'get',
                credentials: 'include',

            }).then(async (res) => {
                const messageText = await res.text()
                setPage(page + 1)
                const finalRes = JSON.parse(messageText)
                setData(finalRes)
                console.log(finalRes);


            })
        }


    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setPage(1)

        // Kiểm tra định dạng tổng số trang
        const totalPagesError = validateTotalPages(totalPages);
        const creationDateError = validateCreationDate(creationDate);
        setError(totalPagesError || creationDateError);

        // Nếu không có lỗi, xử lý tìm kiếm
        if (!error) {
            let queryString = buildQueryString(searchPhrase, totalPages, creationDate)
            setQueryString(`${queryString}&page=${page}`)

            fetch(`http://${host}:3055/v1/api/search-doc-advance?${queryString}&page=${page}`, {
                method: 'get',
                credentials: 'include',

            }).then(async (res) => {
                const messageText = await res.text()

                const finalRes = JSON.parse(messageText)
                setData(finalRes)
                console.log(finalRes);


            })



        }
    };

    return (
        <div className="overlay">
            <div className="advance-search-form">
                <div className="Nav-TB">
                    <h2>Tìm kiếm nâng cao</h2>
                    <button onClick={ () => { setShowAdvancedSearch(false) } }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32">
                            <path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" />
                        </svg>
                    </button>
                </div>

                <p style={{marginBottom: '5px'}}>Chức năng này sẽ giúp bạn tìm kiếm một cụm từ hoặc một đoạn văn từ nội dung của tất cả các văn bản</p>
               
                <p style={{marginBottom: '5px'}}>Từ khóa tìm kiếm <i style={ { color: "red" } }><b>không</b></i> bao gồm tiêu đề hoặc tên tác giả!</p>
                <p>Những điều kiện không dùng đến hãy để trống!</p>

                <form onSubmit={ handleSubmit }>
                    <div className="advance-search-input" style={ { display: 'flex' } }>
                        <div style={ { flex: 0.5, paddingRight: '10px' } }>
                            <label>
                                Cụm từ hoặc đoạn văn
                                <textarea
                                    name="message"
                                    rows="4"
                                    cols="50"
                                    placeholder="Nhập đoạn văn tại đây..."
                                    style={ { width: '100%' } }
                                    value={ searchPhrase }
                                    onChange={ handleInputChange(setSearchPhrase, () => '') } // Không cần validate cho searchPhrase
                                ></textarea>
                            </label>
                        </div>

                        <div style={ { flex: 0.4, paddingLeft: '10px' } }>
                            <label>
                                Tổng số trang <span title="Nhập số trang bạn muốn lọc theo định dạng X-Y"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32"><path fill="currentColor" d="M17 22v-8h-4v2h2v6h-3v2h8v-2zM16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8" /><path fill="currentColor" d="M26 28H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2M6 6v20h20V6Z" /></svg></span>
                                <input
                                    type="text"
                                    placeholder="1-100"
                                    style={ { width: '100%', maxWidth: '500px', marginBottom: "18px" } }
                                    value={ totalPages }
                                    onChange={ handleInputChange(setTotalPages, validateTotalPages) }
                                />
                            </label>

                            <label>
                                Ngày tạo tài liệu <span title="Nhập ngày tạo tài liệu theo định dạng (ngày tạo)T(giờ tạo)_(ngày tạo)T(giờ tạo)"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32"><path fill="currentColor" d="M17 22v-8h-4v2h2v6h-3v2h8v-2zM16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8" /><path fill="currentColor" d="M26 28H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2M6 6v20h20V6Z" /></svg></span>
                                <input
                                    type="text"
                                    placeholder="2020-01-01T00:00:00_2025-12-30T23:59:59"
                                    style={ { width: '100%', maxWidth: '310px' } }
                                    value={ creationDate }
                                    onChange={ handleInputChange(setCreationDate, validateCreationDate) }
                                />
                            </label>
                        </div>

                        <div style={ { flex: 0.1, display: 'flex', flexDirection: 'column', justifyContent: 'center' } }>
                            <button id="search-refresh-btn" type="button" onClick={ handleRefresh }>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V5q0-.425.288-.712T19 4t.713.288T20 5v5q0 .425-.288.713T19 11h-5q-.425 0-.712-.288T13 10t.288-.712T14 9h3.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.7 0 3.113-.862t2.187-2.313q.2-.35.563-.487t.737-.013q.4.125.575.525t-.025.75q-1.025 2-2.925 3.2T12 20" />
                                </svg>
                            </button>
                            <button
                                id="search-advance-btn"
                                type="submit"
                                disabled={ !!error } // Disable button if there's an error
                                style={ { opacity: error ? 0.5 : 1 } } // Make button look disabled
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="24x" height="24px">
                                    <path d="M 22.205078 2 C 21.715078 2 21.29775 2.3558438 21.21875 2.8398438 L 20.263672 8.6933594 C 19.063672 9.0383594 17.911172 9.5114688 16.826172 10.105469 L 11.996094 6.6542969 C 11.597094 6.3692969 11.054031 6.4167188 10.707031 6.7617188 L 6.8203125 10.648438 C 6.4773125 10.991437 6.4280312 11.530734 6.7070312 11.927734 L 10.107422 16.791016 C 9.5024219 17.886016 9.0209219 19.045953 8.6699219 20.251953 L 2.8378906 21.222656 C 2.3558906 21.302656 2.0019531 21.719031 2.0019531 22.207031 L 2.0019531 27.707031 C 2.0019531 28.192031 2.3491719 28.608359 2.8261719 28.693359 L 8.6582031 29.726562 C 9.0072031 30.929562 9.4887031 32.0895 10.095703 33.1875 L 6.6542969 38 C 6.3702969 38.397 6.4167188 38.942063 6.7617188 39.289062 L 10.648438 43.179688 C 10.991437 43.522688 11.532688 43.571969 11.929688 43.292969 L 16.800781 39.880859 C 17.893781 40.481859 19.047141 40.958687 20.244141 41.304688 L 21.220703 47.166016 C 21.299703 47.647016 21.716078 48 22.205078 48 L 27.705078 48 C 28.190078 48 28.605453 47.652781 28.689453 47.175781 L 29.007812 45.386719 C 25.420813 43.311719 23 39.442 23 35 C 23 33.897 23.160453 32.833359 23.439453 31.818359 C 20.325453 31.108359 18 28.329 18 25 C 18 21.134 21.134 18 25 18 C 28.329 18 31.108359 20.325453 31.818359 23.439453 C 32.833359 23.160453 33.897 23 35 23 C 39.442 23 43.310766 25.418859 45.384766 29.005859 L 47.171875 28.693359 C 47.650875 28.609359 47.998047 28.192031 47.998047 27.707031 L 47.998047 22.207031 C 47.999047 21.717031 47.644156 21.299703 47.160156 21.220703 L 41.25 20.255859 C 40.904 19.069859 40.431844 17.928609 39.839844 16.849609 L 43.289062 11.933594 C 43.568063 11.536594 43.520734 10.994391 43.177734 10.650391 L 39.287109 6.7636719 C 38.940109 6.4176719 38.394094 6.3731563 37.996094 6.6601562 L 33.154297 10.140625 C 32.065297 9.538625 30.915656 9.0618437 29.722656 8.7148438 L 28.691406 2.828125 C 28.607406 2.350125 28.191078 2 27.705078 2 L 22.205078 2 z M 35 25 C 29.488997 25 25 29.488997 25 35 C 25 40.511003 29.488997 45 35 45 C 37.396508 45 39.597385 44.148986 41.322266 42.736328 L 47.292969 48.707031 L 48.707031 47.292969 L 42.736328 41.322266 C 44.148986 39.597385 45 37.396508 45 35 C 45 29.488997 40.511003 25 35 25 z M 35 27 C 39.430123 27 43 30.569877 43 35 C 43 39.430123 39.430123 43 35 43 C 30.569877 43 27 39.430123 27 35 C 27 30.569877 30.569877 27 35 27 z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    { error && <p style={ { color: 'red' } }>{ error }</p> }
                    {/* data xuất hiện ở đây */ }
                    { data && (
                        <div>
                            <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } } className="searched-advance-doc-resbar">
                                <div>
                                    <p>Kết quả: tìm thấy { data.metadata.numOfRecordHit } tài liệu trong tổng số { data.metadata.totalOfRecord } tài liệu</p>
                                    { data.metadata.records.length ? (
                                        <p>Tài liệu { data.metadata.page } trong tổng số { data.metadata.numOfRecordHit } tài liệu tìm được</p>
                                    ) : null }
                                </div>
                                <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
                                    <div
                                        style={ { marginRight: '10px', } }
                                        className={ (data.metadata.page == 1 || data.metadata.records.length == 0) ? "btn-search-advance-page-disable" : "btn-search-advance-page" }

                                        onClick={ handleBackwardPage }

                                        disabled={ data.metadata.page == 1 || data.metadata.records.length == 0 } // Disable Button 1
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
                                    </div>
                                    <div
                                        style={ { marginLeft: '-5px' } }
                                        className={ (data.metadata.page == data.metadata.numOfRecordHit || data.metadata.records.length == 0) ? "btn-search-advance-page-disable" : "btn-search-advance-page" }


                                        onClick={ handleForwardPage }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 6l6 6l-6 6" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                { data.metadata.records.map(record => (
                                    <div key={ record._id } className="searched-item">
                                        <div className="searched-doc-img">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 32 32"><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z" /><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z" /><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z" /><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z" /><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892" /><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035" /><path fill="#909090" d="M23.954 2.077V7.95h5.633z" /><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z" /><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892" /></svg>                                                </div>
                                        <div className="searched-doc-info">

                                            <a href={ `/detail/${record._source.title}_${record._id }` }><b >{ record._source.title }</b></a>


                                            <br />
                                            <p>{ record._source.author  }</p>

                                        </div>

                                        
                                    </div>
                                )) }
                            </div>
                        </div>
                    ) }

                </form>
            </div>
        </div>
    );
};

export default AdvancedSearch;
