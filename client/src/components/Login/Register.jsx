import { useState } from "react";
import { Form, redirect, useActionData } from "react-router-dom"



export default function Register() {
    const data = useActionData()

    const [password, setPassword] = useState('');
    const [recheckPassword, setRecheckPassword] = useState('')
    const [error, setError] = useState('');
    const [reerror, setreError] = useState('');
    const handleBlur = () => {
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
        }else{
            setError('')
        }
    };

    const handleRc = () => {
         if(password != recheckPassword){
            setreError('Mật khẩu phải trùng nhau')
        }else{
            setreError('')
        }
    
    }
    return (
        <div className="register-container">
            { data && data.error && data.formId == 'register' &&
                <div className="tb-login-loi">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="none" d="M16 26a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 26m-1.125-5h2.25v-9h-2.25Z" /><path fill="currentColor" d="M16.002 6.171h-.004L4.648 27.997l.003.003h22.698l.002-.003ZM14.875 12h2.25v9h-2.25ZM16 26a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 26" /><path fill="currentColor" d="M29 30H3a1 1 0 0 1-.887-1.461l13-25a1 1 0 0 1 1.774 0l13 25A1 1 0 0 1 29 30M4.65 28h22.7l.001-.003L16.002 6.17h-.004L4.648 27.997Z" /></svg>
                    </div>
                    <div>
                        <h5>Thông báo</h5>
                        { data.error }

                    </div>


                </div> }

                <div className="login register">
            
            <div className="login-content ">
                <h3>Đăng ký</h3>
                <Form method='post' action="/access">
                    <input type='text' name='formId' value="register" style={ { display: 'none' } }></input>

                    <label>
                        <span>Tên tài khoản</span>
                        <input type='text' name='userId'  pattern='[0-9]{8}' placeholder="10000000-99999999" required />
                    </label>
                    <label>
                        <span>Tên hiển thị</span>
                        <input type='text' name='name' required />
                    </label>

                    <label>
                        <span>email</span>
                        <input type='email' name='email' required />
                    </label>

                    <label>
                        <span>Mật khẩu</span>
                        <input type='password' name='password' className={error? "loiInput" : ""}
                            onChange={ (e) => setPassword(e.target.value) }
                            onBlur={ handleBlur }
                            placeholder="tối thiểu 6 từ" required />
                            {error && <span className="loitbip">{error}</span>}
                    </label>
                    <label>
                        <span>Nhập lại mật khẩu</span>
                        <input type='password' name='re-password' className={error? "loiInput" : ""}
                            onChange={ (e) => setRecheckPassword(e.target.value) }
                            onBlur={ handleRc }
                            required />
                            {reerror && <span className="loitbip">{reerror}</span>}

                    </label>
                    
                    <button>Tạo tài khoản</button>

                </Form>
            </div>
        </div>
        


        </div>
    )

}

export const registerAction = async (submission) => {

    

    const loginURL = 'http://localhost:3055/v1/api/register'

    let res = await fetch(loginURL, {
        method: "POST",
        body: JSON.stringify(submission),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    res = await res.text()
    const data = await JSON.parse(res)


    if (data.statusCode == 201) {

        window.location.reload()
        return null
    } else {
        if(data.message.includes('Duplicate')){
            return {
                formId: 'register',
                error: "Tài khoản đã tồn tại"
            }
        }else{
            return {
                formId: 'register',
                error: data.message
            }
        }
        
    }
    //Dang ky 
    // if(res.status != '404'){
    //     window.location.reload();
    //     return null;
    // }else{
    //     return {
    //         error: res.message
    //     }
    // }


}