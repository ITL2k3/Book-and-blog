import _ from 'lodash'
import crypto from 'crypto'

const createRandKey = () => {
    console.log('hi')
    const tokenKey = crypto.randomBytes(25)
    return tokenKey.toString('hex')
}
const getInfoData = ({fields =[], object = {}}) => {
    return  _.pick(object, fields)
}


export {
    getInfoData,
    createRandKey
}