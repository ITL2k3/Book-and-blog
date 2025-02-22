



export default  async function checkAuth(url) {
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    // console.log(res)
    const messageText = await res.text()
    
    const finalRes = JSON.parse(messageText)
    // console.log('fetch thanh cong')
    // console.log(finalRes)
    if(finalRes.statusCode == 200){
        return true
    }else{
        return false
    }
}

const checkDevTool = () => {
    console.log("%c \nVUI LÒNG TẮT F12 VÀ REFRESH LẠI PAGE ĐỂ TIẾP TỤC ĐỌC SÁCH. \n%c", 
        'font-family: "Arial", Arial, sans-serif;font-size:35px;color:red;', 
        "font-size:35px;color:red;"
    );
    console.log("%c \nĐể bảo vệ quyền lợi cho nhà phát hành và khách hàng, vui lòng tắt F12 để có thể tiếp tục đọc sách, chúc bạn đọc sách vui vẻ! \n%c", 
        'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:16px;color:#515152;', 
        "font-size:16px;color:#515152;"
    );
    let startTime = new Date();
    debugger; 
    
    let elapsedTime = new Date() - startTime;
    if (elapsedTime > 10) {
        let firstElement = document.getElementsByTagName('html')[0];
        if (firstElement) {
            firstElement.remove();
        }
    }
    
}
export {
    checkDevTool   
}


// export async function 