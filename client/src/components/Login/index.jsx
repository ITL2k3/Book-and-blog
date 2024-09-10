import { useNavigate } from "react-router-dom"
import Login, { loginAction } from "./Login"
import Register, { registerAction } from "./Register"
import { useEffect, useState } from "react"
import checkAuth from "../../Auth/checkAuth"


const Login_registerElement = () => {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(null)
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
            <Login/>
            <Register/>
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
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
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