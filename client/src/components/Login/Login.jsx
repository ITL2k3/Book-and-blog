import { Form, redirect, useActionData } from "react-router-dom"



export default function Login() {
    const data = useActionData()
    return (
        <div>
            <h3>Login Form</h3>
            <Form method='post' action="/">
                <input type='text' name='formId' value="login" style={{display: 'none'}}></input>
                <label>
                    <span>username</span>
                    <input type='text' name='username' required/>
                </label>
                <label>
                    <span>password</span>
                    <input type='password' name='password' required/>
                </label>
                <button>Login</button>
                
                {data && data.error && <p>{data.error}</p>}
            </Form>

        </div>
    )

}

export const loginAction = async (submission) => {
     
    const loginURL = 'http://localhost:3055/api/login'

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
            error: res.message
        }
    }
    

}