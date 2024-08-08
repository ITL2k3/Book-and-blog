import { createRandKey } from "../utils/index.js"
import JWT from 'jsonwebtoken'




const setToken = (payload, keyToken) => {
        //sign payload wwith keyToken
    console.log('kt:', keyToken)
    const token = JWT.sign(payload,keyToken,{
        expiresIn: "365 days"
    })

    return token

}




export {
    setToken
} 