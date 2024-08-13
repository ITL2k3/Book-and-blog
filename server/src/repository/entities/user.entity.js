

class UserEntity  {
    _userId
    _firstName
    _fullName
    _lastName
    _email
    _password
    _role
    _createAt
    _lastUpdate
    

    constructor({userId, firstName, lastName, email, password, role, createAt, lastUpdate}){
        this._userId = userId
        this._firstName = firstName,
        this._lastName = lastName
        this._fullName = firstName + ' ' + lastName
        this._email = email
        this._password = password
        this._role = role ? role : 'default'
        this._createAt = createAt ? createAt : 'default'
        this._lastUpdate = lastUpdate ? lastUpdate : 'default'
    }
    getQueryString(){
        return `(${this._userId}, '${this._firstName}',
        '${this._lastName}','${this._fullName}', '${this._email}', '${this._password}',
        ${this._role}, ${this._createAt},${this._lastUpdate})`
    }
}

export default UserEntity