import BaseDTO from "./BaseDTO.js";
import Joi from 'joi'
import _ from 'lodash'

class UserDTO extends BaseDTO {
   
    mame
    email
    password
    role

    constructor({userId, name, email, password, role}){
        userId = Number(userId)
        super({id: userId})
        this.email = email ? email : null
        this.password = password ? password : null
        this.role = role ? role : 'default'
        this.name= name 
        this.validateJoiSchemaUser = {
            userId: Joi.number().integer().min(10000000).max(99999999).required(),
            name: Joi.string().required(),
            email:Joi.string().email({
                tlds : true
            }).required(),
            password:Joi.string().required(),
            role: Joi.string()
        }
        this.validateFieldUser = {
            userId: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role
        }


    }
    validateRegister(){
        const fields = ['userId', 'name', 'email', 'password']
        const joiSchemaUser = _.pick(this.validateJoiSchemaUser,fields)
        const validateFieldUser = _.pick(this.validateFieldUser, fields)
        return Joi.object(joiSchemaUser).validate(validateFieldUser)
    }

    validateLogin(){
        const fields = ['userId', 'password']
        const joiSchemaUser = _.pick(this.validateJoiSchemaUser,fields)
        const validateFieldUser = _.pick(this.validateFieldUser, fields)
        return Joi.object(joiSchemaUser).validate(validateFieldUser)
    }

    

}

export default UserDTO