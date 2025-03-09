import { setToken } from '../Auth/authUtils.js'
import { AuthFailureError, BadRequestError, ForbiddenError } from '../common/error.response.js'
import KeyTokenRepo from '../repository/KeyTokenRepo.js'
import UserRepo from '../repository/UserRepo.js'
import { createRandKey, getInfoData } from '../utils/index.js'
import FolderService from './folder.service.js'
import { getKeyToken, saveKeyToken } from './keytoken.service.js'
import bcrypt from 'bcrypt'

const tokenHelper = new KeyTokenRepo()
class AccessService {

    static getAccount = async(userId) => {
      
        const [result] =  await (new UserRepo()).getInfoAccount(userId)
        return {result, userId}
    }

    static register = async(payload) => {
        try {
            //hashed password
            const { password } = payload
            const hashedPassword = await bcrypt.hash(password, 10)
            payload.password = hashedPassword
                //insert into database
            await (new UserRepo()).insertIntoTableValues(payload)
            const signedValue = getInfoData({ fields: ['userId', 'email'], object: payload })

            //insert success -> createToken
            const keyToken = createRandKey()
            const token = setToken(signedValue, keyToken)
            const { userId } = signedValue
            saveKeyToken({ keyToken, userId })
            //init folder
            await FolderService.initFolder(userId)





            return {

                token: token
            }
        } catch (err) {
            throw new BadRequestError(err.message)
        }

    }


    static resetKeyToken = async(userId) => {
       
        const newKeyToken = createRandKey()
        await tokenHelper.updateKeyToken(userId, newKeyToken)
      
    }
    static login = async({ userId, password, roleIN }) => {

        const [foundUser] = await (new UserRepo()).getUserById(userId)
        console.log(foundUser);
        if(foundUser.role != roleIN) throw new ForbiddenError("Permission denied!")
            //check userId and password
        if (!foundUser) {
            throw new BadRequestError('User Not Found')
        }
        const isMatchPassword = await bcrypt.compare(password, foundUser.password)
        if (!isMatchPassword) {
            throw new AuthFailureError('password not match')
        }

        //get tokenKey -> set new token -> return
        const { token_key: tokenKey } = await getKeyToken(userId)

        const {user_id, email, role} = foundUser


        const token = setToken({ userId: user_id, email, role }, tokenKey)

        return {
            user: getInfoData({ fields: ["user_id", "email", "role"], object: foundUser }),
            token: token

        }

    }

    

    // static getUser = async({ userId }) => {

    //     const [res] = await (new UserRepo()).getUserById(userId)
    //     console.log(res)
    //     return res

    // }
}
export default AccessService