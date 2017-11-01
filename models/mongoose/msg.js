const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Errors = require('../../error')
const logger = require('../../util/logger')
const { ObjectId } = Schema.Types

const MSG_TYPES = {
    SYS: 'sys',
    USER: 'user'
}

const msgModel = Schema({
    from: { type: ObjectId, require: true, index: true },
    to: { type: ObjectId, require: true, index: true },
    type: { type: String, enum: ['sys', 'user'], require: true },
    content: { type: String, require: true },
    extra: { type: Schema.Types.Mixed, require: true },
    createTime: { type: Number, default: Date.now().valueOf() }
})

msgModel.index({ from: 1, to: 1 })

async function createMsg(from, to, content, type, extra) {
    const message = await msgModel.create({
            from: from,
            to: to,
            type: type,
            content: content,
            extra: extra
        })
        .catch(e => {
            const errorMsg = 'error creating a message'
            logger.error(errorMsg, { error: e.stack || e })
            throw new Errors.InternalError(errorMsg)
        })
    return message
}

async function listUserReceivedMsg(query) {
    const flow = msgModel.find({ to: query.userId })
    const page = Number(query.page) || 0
    const pageSize = Number(query.pageSize) || 10
    flow.limit(pageSize)
    flow.skip(pageSize * page)
    const msgs = await flow.then()
        .catch(e => {
            const errorMsg = 'error getting received message'
            logger.error(errorMsg, { err: e.stack || e })
            throw new Errors.InternalError(errorMsg)
        })
    return msgs
}

module.exports = {
    Model: msgMdel,
    listUserReceivedMsg,
    createMsg,
    MSG_TYPES
}