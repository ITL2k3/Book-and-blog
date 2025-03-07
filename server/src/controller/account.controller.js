import { BadRequestError, InternalServerError } from "../common/error.response.js"
import { OK, SuccessResponse } from "../common/success.response.js"
import AccountService from "../services/account.service.js"

class AccountController {
    getAccountById = async (req, res, next) => {
        const { id } = req.query
       
        const account = await AccountService.getAccountById(id)
       
        new SuccessResponse({
            message: "Get account by id successfully",
            metadata: account
        }).send(res)
    }

}

export default new AccountController