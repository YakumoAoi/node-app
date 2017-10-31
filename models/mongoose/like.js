const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Errors = require('../../errors')
const logger = require('../../utils/logger').logger
const { ObjectId } = Schema.Types

const LIKE_TYPES = {
    TOPIC: 'topic',
    REPLY: 'reply',
    USER: 'user'
}

const LikeScheme = Schema({
    attachId: { type: ObjectId, required: true, index: true },
    type: { type: String, enum: ['topic', 'reply', 'user'], require: true },
    userId: { type: ObjectId, required: true, index: true },
    ts: { type: Number, default: Date.now().valueOf() },
})

LikeScheme.index({ userId: 1, attachId: 1 })

const LikeModel = mongoose.model('like', LikeScheme)

async function like(userId, attachId, type) {
    let like = await LikeModel.findOne({ userId, attachId })
    if (like) throw new Errors.AlreadyLikedError(userId, attachId)
    like = await LikeModel.create({
            userId,
            attachId,
            type
        })
        .catch(e => {
            logger.errors('error creating like record', { err: e.stack || e })
            throw new Errors.InternalError('error creating like record')
        })
    return like
}

async function disLike(userId, attachId) {
    let like = await LikeModel.findOne({ userId, attachId }, { userId: 1, attachId: 1, _id: 0 })
    if (!like) throw new Errors.NeverLikedError(userId, attachId)
    like = await LikeModel.remove({
            userId,
            attachId
        })
        .catch(e => {
            logger.errors('error removing like record', { err: e.stack || e })
            throw new Errors.InternalError('error removing like record')
        })
}

module.exports = {
    model: LikeModel,
    like,
    disLike,
    LIKE_TYPES
}