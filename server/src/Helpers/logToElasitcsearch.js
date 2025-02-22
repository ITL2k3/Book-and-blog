import client from "../dbs/init.elastic.js"


const writeLog = async ( req, res, next) => {
    const start = Date.now();

    // Lưu thông tin gốc của res.send để ghi log response sau khi request kết thúc
    const originalSend = res.send;

    res.send = async function (body) {
        // Ghi log khi response được gửi đi
        const duration = Date.now() - start;

        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            userId: req.user?.id || 'anonymous',
            ip: req.ip,
            request: {
                headers: req.headers,
                body: req.body,
                query: req.query
            },
            response: {
                status: res.statusCode,
                body: body,
                duration: duration + 'ms'
            }
        };

        // Ghi log vào Elasticsearch
        try {
            await client.index({
                index: 'user_activity_log',
                body: logEntry
            });
        } catch (err) {
            console.error('Failed to log to Elasticsearch:', err);
        }

        // Gửi response về client
        originalSend.call(this, body);
    };

    next();

}

export default writeLog