
import setToken from '../Auth/setToken.js'
import { BadRequestError } from '../common/error.response.js'
import UserRepo from '../repository/UserRepo.js'
import { createRandKey, getInfoData } from '../utils/index.js'

const userRepoHelper = new UserRepo()

class AccessService{
    static register = async(payload) => {
        
        try{
        const res = await userRepoHelper.insertIntoTableValues(payload)
            
        const signedValue = getInfoData({fields: ['userId','email'],object: payload})

        const tokenKey = createRandKey()

        //sign tokenKey to token, create token in db, return token -> controller, set req.cookies.
       
            
        
        return res
        }catch(err){
            throw new BadRequestError(err.message)
        }
        
    }
    static login = async(payload) => {
       
        
        try {
            const res = await userRepoHelper.insertIntoTableValues(payload)
            console.log(res)
            return res
        }catch(err){
            console.log('service catched: ', err.message)
        }
    }
    static getUser = async({userId}) => {
        try{
            const [res] = await userRepoHelper.getValuesById(userId)
            console.log(res)
            return res
            
        }catch(err){
            console.log('service catched: ', err.message)
        }
    }
}

export default AccessService