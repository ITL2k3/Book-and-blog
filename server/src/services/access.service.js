
import { BadRequestError } from '../common/error.response.js'
import UserRepo from '../repository/UserRepo.js'

const userRepoHelper = new UserRepo()

class AccessService{
    static register = async(payload) => {
        
        try{
        console.log(payload)
        const res = await userRepoHelper.insertIntoTableValues(payload)
        console.log(res)
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