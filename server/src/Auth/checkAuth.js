import { AuthFailureError, BadRequestError } from "../common/error.response.js"
import JWT from "jsonwebtoken"
import { getKeyToken } from "../services/keytoken.service.js"
import { getInfoData } from "../utils/index.js"




export const checkToken = async (req,res,next) => {
   

    const token = req.cookies.accessToken
    if(!token) throw new AuthFailureError('token not found!')

   
    const {token_key} = await getKeyToken(req.cookies.userId)

    if(!token_key) throw new BadRequestError('User not Found!!')

    const isValid = JWT.verify(token,token_key)
    if(!isValid) throw new AuthFailureError('Wrong token')


    next()


}