import { loginAction } from "./Login"
import { registerAction } from "./Register"

export const login_registerAction = async ({request}) => {
     
    const data = await request.formData()
    
    switch (data.get('formId')){
        case 'login': {
            const submission = {
                username: data.get('username'),
                password: data.get('password')
            }
            return loginAction(submission)
            break;
        } 
        case 'register': {
            const submission = {
                userId: data.get('userId'),
                firstName: data.get('firstName'),
                lastName: data.get('lastName'),
                email: data.get('email'),
                password: data.get('password'),
                role: 'default'
                
            }
            return registerAction(submission)
            break;
        }
    }
    
    
    

}