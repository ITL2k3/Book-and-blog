

class UserEntity  {
    _userId
    _name
    _lastName
    _email
    _password
    _role
    _createAt
    _lastUpdate
    

    constructor({userId, name, email, password, role, createAt, lastUpdate}){
        this._userId = userId
        this._name = name
        this._email = email
        this._password = password
        this._role = role ? role : 'default'
        this._createAt = createAt ? createAt : 'default'
        this._lastUpdate = lastUpdate ? lastUpdate : 'default'
    }
    getQueryString(){
        return `(${this._userId}, '${this._name}', '${this._email}', '${this._password}',
        ${this._role}, ${this._createAt},${this._lastUpdate})`
    }
}

export default UserEntity