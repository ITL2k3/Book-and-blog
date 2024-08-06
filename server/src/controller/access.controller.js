import { CREATED } from "../common/success.response.js"
import AccessService from "../services/access.service.js"

class AccessController {
    register = async (req, res, next) => {
        new CREATED({
            message: 'register success',
            metaData: await AccessService.register(req.body)
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