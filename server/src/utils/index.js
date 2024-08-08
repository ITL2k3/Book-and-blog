import _ from 'lodash'
import crypto from 'crypto'

const createRandKey = () => {

    const tokenKey = crypto.randomBytes(25)
    return tokenKey.toString('hex')
}
const getInfoData = ({fields =[], object = {}}) => {
    return  _.pick(object, fields)
}

const setHeaderCookie = (nameCookie, valueCookie, cookieOptions) => {
    return `${nameCookie}=${valueCookie}; ${Object.entries(cookieOptions).map(([key, value]) => `${key}=${value}`).join('; ')}`
     
}

export {
    getInfoData,
    createRandKey,
    setHeaderCookie
}