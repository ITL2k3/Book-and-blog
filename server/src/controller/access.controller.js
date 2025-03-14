import { BadRequestError } from "../common/error.response.js"
import { CREATED, OK, SuccessResponse } from "../common/success.response.js"
import permission from "../configs/config.permission.js"
import UserDTO from "../dtos/UserDTO.js"
import AccessService from "../services/access.service.js"
import { setHeaderCookie } from "../utils/index.js"
import LogService from "../services/log.service.js"
class AccessController {
    getAccount = async(req, res, next) => {
        console.log(req.user);
        new OK({
            metadata: await AccessService.getAccount(req.user.userId)
        }).send(res)
    }
    register = async(req, res, next) => {
        console.log(req.body);
        //check valid user
        const reqUserDTo = new UserDTO(req.body)

        const isValidUser = reqUserDTo.validateRegister()
        if (isValidUser && isValidUser["error"]) {
            throw new BadRequestError(
                isValidUser["error"].message
            )
        }
        const validUser = isValidUser.value
        const { token } = await AccessService.register(validUser)



        //not throw error <=> register success -> send cookies
        //set token cookies and send request
        let setHeaderArray = [{
                    'Set-Cookie': setHeaderCookie('accessToken', token, {
                        'Max-Age': 10000000,
                        httpOnly: true
                    })
                },
                {
                    'Set-Cookie': setHeaderCookie('userId', (validUser.userId).toString(), {
                        'Max-Age': 10000000,

                    })
                }
            ]
            //Ghi lại lịch sử hoạt động của người dùng
        LogService.writeUserActivityLog(validUser.userId, 'register', `user ${validUser.userId} register `)

        new CREATED({
            message: 'register success',
        }).send(res, setHeaderArray)
    }

    login = async(req, res, next) => {
        //check valid User
        const reqUserDTo = new UserDTO(req.body)
        const role = req.body.role ? req.body.role : permission.USER
        const isValidUser = reqUserDTo.validateLogin()
        if (isValidUser && isValidUser["error"]) {
            throw new BadRequestError(
                isValidUser["error"].message
            )
        }
        const validUser = isValidUser.value
        const { user, token } = await AccessService.login({...validUser, roleIN: role })
            //set token cookies and send request
        let setHeaderArray = [{
                    'Set-Cookie': setHeaderCookie('accessToken', token, {
                        'Max-Age': 10000000,
                        httpOnly: true
                    })
                },
                {
                    'Set-Cookie': setHeaderCookie('userId', (user.user_id).toString(), {
                        'Max-Age': 10000000,

                    })
                }
            ]
            //Ghi lại lịch sử hoạt động của người dùng
        LogService.writeUserActivityLog(user.user_id, 'login', `user ${user.user_id} login `)
        new SuccessResponse({
            message: 'Login success',
            metadata: {
                user
            }

        }).send(res, setHeaderArray)

    }








    logout = async(req, res, next) => {

        res.clearCookie('accessToken', { path: '/v1/api' })
        //Ghi lại lịch sử hoạt động của người dùng
        LogService.writeUserActivityLog(req.user.userId, 'logout', `user ${req.user.userId} logout `)
        new SuccessResponse({
            message: 'clear cookies success'
        }).send(res)
    }


    // getUser = async (req, res, next) => {
    //     const userId = req.cookies.userId
    //     const results = await  AccessService.getUser({userId})
    //     new SuccessResponse({
    //         message: 'get success',
    //         metadata: {
    //             results
    //         }

    //     }).send(res)
    // }
}

export default new AccessController