
export default  async function checkAuth(url) {
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    console.log(res)
    const messageText = await res.text()
    
    const finalRes = JSON.parse(messageText)
    console.log('fetch thanh cong')
    console.log(finalRes)
    if(finalRes.status == 200){
        return finalRes
    }else{
        return false
    }
}