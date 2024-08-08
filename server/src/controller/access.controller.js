import { BadRequestError } from "../common/error.response.js"
import { CREATED, SuccessResponse } from "../common/success.response.js"
import UserDTO from "../dtos/UserDTO.js"
import AccessService from "../services/access.service.js"
import { setHeaderCookie } from "../utils/index.js"

class AccessController {
    register = async (req, res, next) => {
        //check valid user
        const reqUserDTo = new UserDTO(req.body)
        const isValidUser = reqUserDTo.validateRegister()
        if(isValidUser && isValidUser["error"]){
            throw new BadRequestError(
                isValidUser["error"].message
            )
        }
        const validUser = isValidUser.value
        const {token} = await AccessService.register(validUser)

     

        //not throw error <=> register success -> send cookies
    
        res.cookie('access_token', token, {
            maxAge: 1000000,
            httpOnly: true
        })
        res.cookie('userId','hmm')
        
        new CREATED({
            message: 'register success',
        }).send(res)
    }




    login = async (req, res, next) => {
        //check valid User
        const reqUserDTo = new UserDTO(req.body)
        const isValidUser = reqUserDTo.validateLogin()
        if(isValidUser && isValidUser["error"]){
            throw new BadRequestError(
                isValidUser["error"].message
            )
        }


        const validUser = isValidUser.value
        const {user, token} = await AccessService.login(validUser)

    
        //set token cookies and send request
        let setHeaderArray = [
            {
                'Set-Cookie': setHeaderCookie('accessToken',token,{
                    'Max-Age': 10000000,
                    httpOnly: true
                })
            },
            {
                'Set-Cookie':  setHeaderCookie('userId',(user.user_id).toString(),{
                    'Max-Age': 10000000,
                   
                })
            }
        ]
        new SuccessResponse({
            message: 'Login success',
            metadata: {
                user
            }

        }).send(res,setHeaderArray)
        
    }






    getUser = async (req, res, next) => {
        const userId = req.cookies.userId
        const results = await  AccessService.getUser({userId})
        new SuccessResponse({
            message: 'get success',
            metadata: {
                results
            }

        }).send(res)
    }
}

export default new AccessController