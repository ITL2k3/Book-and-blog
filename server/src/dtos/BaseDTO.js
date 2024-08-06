class BaseDTO{
    id
    lastUpdate


    constructor({id, lastUpdate}){
        this.id = id ? id : null
        this.lastUpdate = lastUpdate ? lastUpdate : null
    }
}

export default BaseDTO