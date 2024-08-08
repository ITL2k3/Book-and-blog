
import {StatusCodes, ReasonPhrases} from './httpStatusCode/index.js'

class SuccessResponse {
    constructor({message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {}}){
        this.message = message ? message : reasonStatusCode
        this.statusCode = statusCode
        this.reasonStatusCode = reasonStatusCode
        this.metadata = metadata
    }
    send(res,headers ){
        if(headers){
            headers.map(header =>{
                Object.entries(header).map(([key, value]) => {
                    res.setHeader(key,value)
                })
                // console.log(Object.entries(header).map([key, value]) => {})
            })
        }
        
        return res.status(this.statusCode).json(this)
    }
}

class OK extends SuccessResponse{
    constructor({message, metadata}){
        super({message, metadata})
    }
}

class CREATED extends SuccessResponse{
    constructor({option = {},message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata ={}}){
        super({message,statusCode,reasonStatusCode,ReasonPhrases,metadata})
        this.option = option
    }
}

export {
    OK, CREATED, SuccessResponse
}