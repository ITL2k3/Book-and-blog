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

const getFilepathFromString = (string) => {
    return string.split('/').pop()
}


//'Tài chính,Công nghệ,Ngoại ngữ' -> ['tc', 'cn', 'nn']
function convertUpperCateToLowerCate(input) {
    return input.split(',').map(item => {
        const words = item.trim().split(' ');
        const firstLetters = words.map(word => word.charAt(0).toLowerCase()).join('');
        return firstLetters;
    });
}


function parseNumRange(rangeStr){
 

    const [num1, num2] = rangeStr.split('-').map(Number)
    return{
        min: Math.min(num1, num2),
        max: Math.max(num1, num2)
    }

}

function parseDateRange(dateStr) {
    let [date1, date2] = dateStr.split('_');

    // So sánh và đảm bảo start luôn nhỏ hơn end
    return date1 < date2
        ? { start: date1, end: date2 }
        : { start: date2, end: date1 };
}




export {
    getInfoData,
    createRandKey,
    setHeaderCookie,
    getFilepathFromString,
    convertUpperCateToLowerCate,
    parseNumRange,
    parseDateRange
}