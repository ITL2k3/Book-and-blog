import BaseDTO from "./BaseDTO.js";
import Joi from 'joi'
import _ from 'lodash'

class BookDTO extends BaseDTO {
   
    _title
    _author
    _description
    _quantity
    _thumbnail

    constructor({title, author, description, quantity, thumbnail}){
        super({})
        this._title = title
        this._author = author
        this._description = description
        this._quantity = quantity
        this._thumbnail = thumbnail

        this.validateJoiSchemaUser = {
            
            title: Joi.string().max(200).required(),
            author: Joi.string().max(200).required(),
            description: Joi.string(),
            quantity: Joi.number(),
            thumbnail: Joi.string()
           
        }
        this.validateFieldUser = {
            title: this._title,
            author: this._author,
            description: this._description,
            quantity: this._quantity,
            thumbnail: this._thumbnail
        }


    }
    validateBook(){
        const fields = ['title', 'author','description', 'quantity', 'thumbnail']
        const joiSchemaUser = _.pick(this.validateJoiSchemaUser,fields)
        const validateFieldUser = _.pick(this.validateFieldUser, fields)
        return Joi.object(joiSchemaUser).validate(validateFieldUser)
    }


    

}

export default BookDTO