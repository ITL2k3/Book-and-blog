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
                    <input type='text' name='userId' pattern='[0-9]{8}'  required/>
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
                    <input type='email' name='email' required/>
                </label>
                <label>
                    <p>password</p>
                    <input type='password' name='password' required/>
                </label>
                <button>register</button>
                
                {data && data.error && data.formId =='register' &&<p>{data.error}</p>}
            </Form>

        </div>
    )

}

export const registerAction = async (submission) => {

    
    const loginURL = 'http://localhost:3055/v1/api/register'

    let res = await fetch(loginURL,{
        method: "POST",
        body:JSON.stringify(submission),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    res = await res.text()
    const data = await JSON.parse(res)

   
    if(data.statusCode == 201){
        
        window.location.reload()
        return null
    }else{
        
        return {
            formId: 'register',
            error: data.message
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