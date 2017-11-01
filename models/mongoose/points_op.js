const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Errors = require('../../errors')
const logger = require('../../utils/logger').logger
const { ObjectId } = Schema.Types

const POINT_OP_TYPES = {
    LIKE: 'like',
    DISLIKE: 'dislike',
    REPLY: 'reply'
}

const PointsOpSchema = Schema({
    userId: { type: ObjectId, require: true },
    points: { type: Number, require: true },
    time: { type: Number, default: Date.now().valueof() },
    type: { type: String }
})

const pointsOpModel = Schema.model('point_op', PointsOpSchema)

async function createPointOp(userId, type, points) {
    const op = await pointsOpModel.create({
            userId,
            type,
            points
        })
        .catch(e => {
            const errorMsg = 'error creating points op'
            logger.error(errorMsg, { err: e.stack || e })
            throw new Errors.InternalErrors(errorMsg)
        })
}

module.exports = {
    model: pointsOpModel,
    createPointOp,
    POINT_OP_TYPES
}