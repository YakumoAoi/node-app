const Msg = require('../models/mongoose/msg')
const redis = require('./redis_service')
const Errors = require('../error')
const logger = require('../util/logger').logger

const UNREAD_MSGS_HSET = 'unread_msgs_hset'

async function sendMsgByUser(from, to, content) {
    const msg = await Msg.createMsg(from, to, content, Msg.MSG_TYPES.USER)
    await _incrUserUnreadCount(to, 1)
    return msg
}

async function sendMsgBySys(from, to, content) {}

async function _incrUserUnreadCount(userId, incr) {
    const result = await redis.hincrby(UNREAD_MSGS_HSET, userId, incr)
        .catch(e => {
            const errorMsg = 'error incr unread count'
            logger.error(errorMsg, { err: e.stack || e })
            throw new Errors.InternalError(errorMsg)
        })
    return result
}

async function _clearUserUnreadCount(userId, incr) {
    const result = await redis.hdel(UNREAD_MSGS_HSET, userId, incr)
        .catch(e => {
            const errorMsg = 'error clear unread count'
            logger.error(errorMsg, { err: e.stack || e })
            throw new Errors.InternalError(errorMsg)
        })
    return result
}

async function getUserUnreadCount(userId) {
    const result = await redis.hget(UNREAD_MSGS_HSET, userId)
        .then(r => {
            return Number(r) || 0
        })
        .catch(e => {
            const errorMsg = 'error get user unread count'
            logger.error(errorMsg, { err: e.stack || e })
            throw new Errors.InternalError(errorMsg)
        })
    return result
}

async function getUserReceivedMsgs(query) {
    const msgs = await Msg.listUserReceivedMsg(query)
    await _clearUserUnreadCount(query.userId)
    return msgs
}

module.exports = {
    sendMsgByUser,
    getUserReceivedMsgs,
    getUserUnreadCount
}