const User = require('../models/mongoose/user')
const PointsOp = require('../models/mongoose/points_op')
const redis = require('./redis_server')
const logger = require('../util/logger')
const Errors = require('../error')
const USER_POINTS_SORTS_SET_KEY = 'user_point_sort_set'

async function incrUserPoints(userId, incr, type) {
    await User.incrPoints(userId, incr)
    await PointsOp.createPointOp(userId, type, incr)
    await redis.zincby(USER_POINTS_SORTS_SET_KEY, incr, userId)
        .catch(e => {
            const errorMsg = 'error incr points to redis sorted set'
            logger.error(errorMsg, { err: e.stack || e })
            throw new Errors.InternalError(errorMsg)
        })
}

async function getPointRankBrief() {
    const userIds = await redis.zrevrangebyscore(USER_POINTS_SORTS_SET_KEY, '+inf', '-inf', 'LIMIT', 0, 5)
        .catch(e => {
            const errorMsg = 'error getting points from redis'
            logger.error(errorMsg, { err: e.stack || e })
            throw new Errors.InternalError(errorMsg)
        })
    if (!userIds || userIds.length === 0) return []
    const users = await User.model.find({ _id: { $in: userIds } }, { _id: 1, name: 1, points: 1 })
    return users
}

module.exports = {
    incrUserPoints,
    getPointRankBrief
}