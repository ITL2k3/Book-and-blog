import BaseDTO from "./BaseDTO.js";
import Joi from 'joi'
import _ from 'lodash'

class UserDTO extends BaseDTO {
   
    firstName
    lastName
    email
    password
    role

    constructor({userId, firstName, lastName, email, password, role}){
        userId = Number(userId)
        super({id: userId})
        this.firstName = firstName ? firstName : null
        this.lastName = lastName ? lastName : null
        this.email = email ? email : null
        this.password = password ? password : null
        this.role = role ? role : 'default'

        this.validateJoiSchemaUser = {
            userId: Joi.number().integer().min(10000000).max(99999999).required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email:Joi.string().email({
                tlds : true
            }).required(),
            password:Joi.string().required(),
            role: Joi.string()
        }
        this.validateFieldUser = {
            userId: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            role: this.role
        }


    }
    validateRegister(){
        const fields = ['userId', 'firstName', 'lastName', 'email', 'password']
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