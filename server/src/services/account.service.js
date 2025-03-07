import { BadRequestError, NotFoundError } from "../common/error.response.js"
import AccountRepo from "../repository/AccountRepo.js"

const accountHelper = new AccountRepo()

class AccountService {
    static getAccountById = async (id) => {
        const [account] = await accountHelper.getAccountById(id)
        if(!account) throw new NotFoundError('Account not found')
        return account
    }
}

export default AccountService