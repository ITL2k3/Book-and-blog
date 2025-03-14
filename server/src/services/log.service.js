import UserRepo from "../repository/UserRepo.js"


const userHelper = new UserRepo()
class LogService {
    //Ghi lại lịch sử hoạt động của người dùng
    static writeUserActivityLog(userId, action_type, action_detail) {
        const result = userHelper.writeUserActivityLog(userId, action_type, action_detail)
        return result
    }

    static getUserActivityLog(userId) {
        const result = userHelper.getUserActivityLog(userId)
        return result
    }
}

export default LogService