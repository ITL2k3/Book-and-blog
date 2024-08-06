import { AuthFailureError } from "../common/error.response.js"


export const checkToken = async (req,res,next) => {
   
    const token = req.cookies.access_token
    
    if(!token){
        throw new AuthFailureError('token not found!')
    }
    next()


}