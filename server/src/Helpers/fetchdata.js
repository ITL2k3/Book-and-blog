const deleteDataFromChatPDFAPI = async (src_id) => {
    //delete soucrce id from chatPDF API 

    const config = {
        headers: {
            "x-api-key": process.env.API_KEY_CHATPDF ,
            "Content-Type": "application/json",
        },
    };

    const data = {
        sources: [src_id],//link pdf cũ
    };

    // Sử dụng fetch để gửi yêu cầu POST

    await fetch("https://api.chatpdf.com/v1/sources/delete", {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify(data),
    })
}



export {
    deleteDataFromChatPDFAPI
}