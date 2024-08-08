import { Form, redirect, useActionData } from "react-router-dom"



export default function Login() {
    const data = useActionData()
    return (
        <div>
            <h3>Login Form</h3>
            <Form method='post' action="/">
                <input type='text' name='formId' value="login" style={{display: 'none'}}></input>
                <label>
                    <span>MSSV</span>
                    <input type='text' name='userId' required/>
                </label>
                <label>
                    <span>password</span>
                    <input type='password' name='password' required/>
                </label>
                <button>Login</button>
                
                {data && data.error && data.formId =='login' &&<p>{data.error}</p>}
            </Form>

        </div>
    )

}

export const loginAction = async (submission) => {

    const loginURL = 'http://localhost:3055/v1/api/login'
    console.log(submission)
    const res = await fetch(loginURL,{
        method: "POST",
        body:JSON.stringify(submission),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    console.log('res: ', res)
    //Dang nhap thanh cong 
    if(res.status != '404'){
        window.location.reload();
        return null;
    }else{
        return {
            formId: 'login',
            error: res.message
        }
    }
    

}