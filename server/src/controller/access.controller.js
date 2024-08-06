import { BadRequestError } from "../common/error.response.js"
import { CREATED } from "../common/success.response.js"
import UserDTO from "../dtos/UserDTO.js"
import AccessService from "../services/access.service.js"

class AccessController {
    register = async (req, res, next) => {

        const reqUserDTo = new UserDTO(req.body)
        const isValidUser = reqUserDTo.validateRegister()
        if(isValidUser && isValidUser["error"]){
            throw new BadRequestError(
                isValidUser["error"].message
            )
        }
        const payload = isValidUser.value
    
        const metaData = await AccessService.register(payload)
        //not throw error <=> register success -> send token
        


        // set tokens
        new CREATED({
            message: 'register success',
            metaData: metaData
        }).send(res)
        
    }






    getUser = async (req, res, next) => {
        const results = await  AccessService.getUser(req.query)
        res.send({
            message: 'register success',
            metaData: results
        })
    }
}

export default new AccessController