import KeyTokenRepo from "../repository/KeyTokenRepo.js"





const saveKeyToken = async(data) => {

    const res = await (new KeyTokenRepo).insertIntoTableValues(data)
    return res
}

const getKeyToken = async(userId) => {
    return await (new KeyTokenRepo).getKeyTokenByUserId(userId)
}



export {
    saveKeyToken,
    getKeyToken
}