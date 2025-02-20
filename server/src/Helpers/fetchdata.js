import { InternalServerError } from "../common/error.response.js";

const deleteDataFromChatPDFAPI = async(src_id) => {
    //delete soucrce id from chatPDF API 

    const config = {
        headers: {
            "x-api-key": process.env.API_KEY_CHATPDF,
            "Content-Type": "application/json",
        },
    };

    const data = {
        sources: [src_id], //link pdf cũ
    };

    // Sử dụng fetch để gửi yêu cầu POST

    await fetch("https://api.chatpdf.com/v1/sources/delete", {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify(data),
    })
}


const fetchVectorFromMBertHost = async(text) => {
    try {
        const response = await fetch('http://localhost:8000/get_book_vector/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: text })
        })

        const { book_vector } = JSON.parse(await response.text());

        return book_vector
    } catch (err) {
        throw new InternalServerError('failed to fetch mBertServer')
    }

}


export {
    deleteDataFromChatPDFAPI,
    fetchVectorFromMBertHost
}