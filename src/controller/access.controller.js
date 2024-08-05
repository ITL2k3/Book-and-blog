import AccessService from "../services/access.service.js"

class AccessController {
    register = async (req, res, next) => {
        const results = AccessService.login(req.body)
        res.send({
            message: 'register success',
            metaData: results
        })
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