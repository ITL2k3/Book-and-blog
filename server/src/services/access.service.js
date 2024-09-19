import { setToken } from '../Auth/authUtils.js'
import { AuthFailureError, BadRequestError } from '../common/error.response.js'
import UserRepo from '../repository/UserRepo.js'
import { createRandKey, getInfoData } from '../utils/index.js'
import { getKeyToken, saveKeyToken } from './keytoken.service.js'
import bcrypt from 'bcrypt'

class AccessService {

    static getAccount = async(userId) => {
      
        const [result] =  await (new UserRepo()).getInfoAccount(userId)
        return result
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






            return {

                token: token
            }
        } catch (err) {
            throw new BadRequestError(err.message)
        }

    }



    static login = async({ userId, password }) => {

        const [foundUser] = await (new UserRepo()).getUserById(userId)
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
            user: getInfoData({ fields: ["user_id", "email"], object: foundUser }),
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