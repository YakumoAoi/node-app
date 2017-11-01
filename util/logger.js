const winston = require('winston')
require('winston-daily-rotate-file')

const logger = new winston.Logger({
    transports: [
        new winston.transports.DailyRotateFile({
            name: 'info-logger',
            filename: './log/info.log',
            datePattern: 'yyyy-MM-dd',
            level: 'info'
        }),
        new winston.transports.DailyRotateFile({
            name: 'error-logger',
            filename: './log/error.log',
            datePattern: 'yyyy-MM-dd',
            level: 'error'
        })
    ]
})

const reqLogger = new winston.Logger({
    transports: [
        new winston.transports.DailyRotateFile({
            name: 'request-logger',
            filename: './log/request.log',
            datePattern: 'yyyy-MM-dd',
            level: 'info'
        })
    ]

})

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    logger.add(winston.transports.Console)
    reqLogger.add(winston.transports.Console)
}

module.exports = {
    logger,
    reqLogger
}