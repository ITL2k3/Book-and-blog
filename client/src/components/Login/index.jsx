import { loginAction } from "./Login"
import { registerAction } from "./Register"

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