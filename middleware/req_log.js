const logger = require('../util/logger').reqLogger

function requestLogger(req, res, next) {
    const content = {
        method: req.method,
        originUrl: req.originUrl,
        query: req.query,
        body: req.body,
        user: req.user,
        httpStatusCode: req.httpStatusCode,
        ip: req.ip || req.ips || req.get('X-Real-Ip')
    }
    logger.info('request', content)
    next()
}

module.exports = {
    requestLogger
}