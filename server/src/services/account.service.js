import { BadRequestError, NotFoundError } from "../common/error.response.js"
import AccountRepo from "../repository/AccountRepo.js"
import AccessService from "./access.service.js"

const accountHelper = new AccountRepo()

class AccountService {
    static getAccountById = async(id) => {
        const [account] = await accountHelper.getAccountById(id)
        if (!account) throw new NotFoundError('Account not found')
        return account
    }

    static getAllAccount = async() => {
        const accounts = await accountHelper.getAllAccount()
        return accounts
    }

    static deleteAccount = async(id) => {
        const account = await accountHelper.deleteAccount(id)
        if (!account) throw new NotFoundError('Account not found')
        return account
    }

    static updateRole = async(id, role) => {
        const account = await accountHelper.updateRole(id, role)
        if (!account) throw new NotFoundError('Account not found')
            //reset keytoken
        await AccessService.resetKeyToken(id)
        return account
    }


}



export default AccountService