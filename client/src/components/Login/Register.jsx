import { Form, redirect, useActionData } from "react-router-dom"



export default function Register() {
    const data = useActionData()
    return (
        <div>
            <h3>Register Form</h3>
            <Form method='post' action="/">
                <input type='text' name='formId' value="register" style={{display: 'none'}}></input>

                <label>
                    <p>userId</p>
                    <input type='text' name='userId' required/>
                </label>
                <label>
                    <p>first name</p>
                    <input type='text' name='firstName' required/>
                </label>
                <label>
                    <p>last name</p>
                    <input type='text' name='lastName' required/>
                </label>
                <label>
                    <p>email</p>
                    <input type='text' name='email' required/>
                </label>
                <label>
                    <p>password</p>
                    <input type='password' name='password' required/>
                </label>
                <button>register</button>
                
                {data && data.error && <p>{data.error}</p>}
            </Form>

        </div>
    )

}

export const registerAction = async (submission) => {

    
    const loginURL = 'http://localhost:3055/v1/api/register'

    const res = await fetch(loginURL,{
        method: "POST",
        body:JSON.stringify(submission),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    console.log('res: ', res)
    if(res.statusCode == 201){
        window.location.reload()
        return null
    }else{
        return {
            error: res.message
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