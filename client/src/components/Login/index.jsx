import { useNavigate } from "react-router-dom"
import Login, { loginAction } from "./Login"
import Register, { registerAction } from "./Register"
import { useEffect, useState } from "react"
import checkAuth from "../../Auth/checkAuth"

import './access.css'
const Login_registerElement = () => {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(null)
    const [option, setOption] = useState(1)
    useEffect(() => {
        checkAuth('http://localhost:3055/v1/api/')
        .then((res) => {
            setIsLogin(res)
        }).catch((error) => {
            console.error("Authentication check failed:", error);
        });
    }, [])
    if (isLogin){
        navigate('/')
    }
    return (
        <>
            <div className="logo-access">LibOnl</div>
            {option && <Login />}
            {option && <div className="newto">
                <div class="divider" >
                    <span class="divider-text">Chưa có tài khoản?</span>
                </div>
                <button class="create-account" onClick={() => {
                    setOption(!option)
                }} >Đăng ký</button>
            </div> }
            {!option && <Register />}
            {!option && <div className="newto">
                <div class="divider" >
                    <span class="divider-text">Đã có tài khoản?</span>
                </div>
                <button class="create-account" onClick={() => {
                    setOption(!option)
                }} >Đăng Nhập</button>
            </div> }
            
            
            
        </>
    )
}

const login_registerAction = async ({request}) => {
    
    const data = await request.formData()
    const formAction = data.get('formId')
    
    if(formAction == 'login'){
        const submission = {
            userId: data.get('userId'),
            password: data.get('password')
        }
        return loginAction(submission)
    }else if(formAction == 'register'){
        const submission = {
            userId: data.get('userId'),
            name: data.get('name'),
            email: data.get('email'),
            password: data.get('password'),
            role: 'default'
            
        }
        return registerAction(submission)
    }
   
    
    
    

}
export default login_registerAction

export {
    Login_registerElement
}