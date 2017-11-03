const User = require('../models/mongoose/user')
const Topic = require('../models/mongoose/topic')
const PointsOp = require('../models/mongoose/points_op')
const Like = require('../models/mongoose/like')
const { ObjectId } = require('mongoose').Types
const PointService = require('./point_service')

async function likeTopic(userId, attachedId) {
    await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.TOPIC)
    await Topic.likeTopic(attachedId)
    await PointService.incrUserPoints(ObjectId(userId), 10, PointsOp.POINT_OP_TYPES.LIKE)
    return true
}
async function likeReply(userId, attachedId) {
    await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.REPLY)
    await Topic.likeReply(attachedId)
    await PointService.incrUserPoints(ObjectId(userId), 10, PointsOp.POINT_OP_TYPES.LIKE)
    return true
}
async function dislikeTopic(userId, attachedId) {
    await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.TOPIC)
    await Topic.likeTopic(attachedId)
    await PointService.incrUserPoints(ObjectId(userId), -10, PointsOp.POINT_OP_TYPES.DISLIKE)
    return true
}
async function dislikeRely(userId, attachedId) {
    await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.REPLY)
    await Topic.likeReply(attachedId)
    await PointService.incrUserPoints(ObjectId(userId), -10, PointsOp.POINT_OP_TYPES.DISLIKE)
    return true
}

module.exports = {
    likeReply,
    likeTopic,
    dislikeRely,
    dislikeTopic
}