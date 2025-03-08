import BaseRepo from "./BaseRepo.js";
import connection from "../dbs/init.mysql.js";
class ChatRepo extends BaseRepo {
    async createMessage(conservationId, senderId, receiverId, message) {
        const [result, fields] = await connection.query(`
            INSERT INTO messages 
            VALUES (default, ?, ?, ?, ?, default, default)
        `, [conservationId, senderId, receiverId, message])
        return result
    }
    async getMessageById(messageId) {
        const [result, fields] = await connection.query(`
            SELECT * FROM messages WHERE id = ?
        `, [messageId])
        return result
    }
    async getMessageByConversationId(conversationId) {
        const [result, fields] = await connection.query(`
            SELECT * FROM messages WHERE conversation_id = ?
        `, [conversationId])
        return result
    }

    async UpdateMessageStatus({conversationId, status}) {
        const [result, fields] = await connection.query(`
            UPDATE messages SET status = ? WHERE conversation_id = ?
        `, [status, conversationId])
        return result
    }

    async findConversation(senderId, receiverId) {
        const [result, fields] = await connection.query(`
            SELECT id FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
        `, [senderId, receiverId, receiverId, senderId])
        return result
    }

    async createConversation(senderId, receiverId) {
        const [result, fields] = await connection.query(`
            INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)
        `, [senderId, receiverId])
        return result
    }
    async getAllConservationOfOneUser(userId) {
        const [result, fields] = await connection.query(`
            SELECT * FROM conversations WHERE user1_id = ? OR user2_id = ?
        `, [userId, userId])
        return result
    }

    async updateStatusConversation({conversationId, isRead}) {
        const [result, fields] = await connection.query(`
            UPDATE conversations SET is_read= ? WHERE id = ?
        `, [isRead, conversationId])
        return result
    }

    // async getChat(conservationId) {
    //     const [result, fields] = await connection.query(`
    //         SELECT * FROM messages WHERE conservation_id = ?
    //     `, [conservationId])
    //     return result
    // }

    // async getChatByUserId(userId) {
    //     const [result, fields] = await connection.query(`
    //         SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ?
    //     `, [userId, userId])
    //     return result
    // }
}


export default ChatRepo