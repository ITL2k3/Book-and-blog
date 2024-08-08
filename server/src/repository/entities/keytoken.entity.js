
class KeyTokenEntity {
    _tokenId
    _tokenKey 
    _userId
    

    constructor({keyToken, userId}){
        this._tokenId = 'default'
        this._tokenKey = keyToken
        this._userId = userId
    }

    getQueryString(){
        return `(${this._tokenId},'${this._tokenKey}', ${this._userId})`
    }

    
}

export default KeyTokenEntity