

class UserEntity  {
    _userId
    _firstName
    _lastName
    _email
    _password
    _role
    

    constructor({userId, firstName, lastName, email, password, role}){
        this._userId = userId
        this._firstName = firstName
        this._lastName = lastName
        this._email = email
        this._password = password
        this._role = role
    }
    getQueryString(){
        return `(${this._userId}, '${this._firstName}', 
        '${this._lastName}', '${this._email}', '${this._password}', 
        '${this._role}',default)`
    }
}

export default UserEntity