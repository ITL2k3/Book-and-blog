import { Form, redirect, useActionData } from "react-router-dom"



export default function Login() {
    const data = useActionData()
    console.log(data);
    return (
        <div className="login-container">
            { data && data.error && data.formId == 'login' &&
                <div className="tb-login-loi">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="none" d="M16 26a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 26m-1.125-5h2.25v-9h-2.25Z" /><path fill="currentColor" d="M16.002 6.171h-.004L4.648 27.997l.003.003h22.698l.002-.003ZM14.875 12h2.25v9h-2.25ZM16 26a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 26" /><path fill="currentColor" d="M29 30H3a1 1 0 0 1-.887-1.461l13-25a1 1 0 0 1 1.774 0l13 25A1 1 0 0 1 29 30M4.65 28h22.7l.001-.003L16.002 6.17h-.004L4.648 27.997Z" /></svg>
                    </div>
                    <div>
                        <h5>Thông báo</h5>
                        { data.error }

                    </div>


                </div> }

            <div className="login">

                <div className="login-content">
                    <h3>Đăng Nhập</h3>
                    <Form method='post' action="/access">

                        <input type='text' name='formId' value="login" style={ { display: 'none' } }></input>
                        <label>
                            <span>Tên tài khoản</span> <br />
                            <input type='text' name='userId'  pattern='[0-9]{8}' required />
                        </label>
                        <label>
                            <span>Mật khẩu</span> <br />
                            <input type='password' placeholder=" " name='password' required />
                        </label>
                        <button >Đăng nhập </button>

                    </Form>
                </div>
            </div>

            






        </div>
    )

}

export const loginAction = async (submission) => {

    const loginURL = 'http://localhost:3055/v1/api/login'
    console.log(submission)
    const res = await fetch(loginURL, {
        method: "POST",
        body: JSON.stringify(submission),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    console.log('res: ', res)
    //Dang nhap thanh cong 
    if (res.status == '200') {
        console.log('hello world');
        window.location.reload();
        return null;
    } else {
        console.log('got');
        return {
            formId: 'login',
            error: 'Sai thông tin đăng nhập!'
        }
    }


}