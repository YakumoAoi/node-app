const mongoose = require('mongoose')
const schema = mongoose.Schema

const replySchema = new schema({
    creator: schema.Types.ObjectId,
    content: { type: String, require: true },
    likes: { type: Number, default: 0 }

})

const topicSchema = new schema({
    creator: { type: String, require: true },
    title: { type: String, require: true },
    content: String,
    likes: { type: Number, default: 0 },
    replyList: [replySchema]
})

topicSchema.index({ _id: 1 })

const topicModel = mongoose.model('topics', topicSchema)

async function createNewTopic(params) {
    if (!params.title) throw new Error('the title is required in topic')
    if (params.content.length < 5) throw new Error('content must have more than five words')
    const topic = new topicModel({ creator: params.creator, title: params.title, content: params.content })
    await topic.save()
        .catch(e => {
            throw new Error('Error creating new topic ')
            console.log(e)
        })
    return topic
}

async function getTopic(params = { page: 0, pageSize: 10 }) {
    let result = topicModel.find({})
    result.skip(params.page * params.pageSize)
    result.limit(params.pageSize)
    return await result
        .catch(e => {
            throw new Error('errpr getting topic in db')
            console.log(e)
        })
}

async function getTopicById(topicId) {
    return await topicModel.find({ _id: topicId })
        .catch(e => {
            throw new Error('error getting topic by id')
            console.log(e)
        })
}
async function updateTopicById(topicId, update) {
    if (!(update.title && update.content)) throw new Error('Both title and content can\'t be empty')
    return await topicModel.update({ _id: topicId }, update, { new: true })
        .catch(e => {
            throw new Error('fail to update topic by id')
            console.log(e)
        })
}

async function replyATopic(params) {
    if (!params.creator) throw new Error('fail to get user')
    if (!params.content) throw new Error('the content is required in reply')
    return await topicModel.update({ _id: params.topicId }, { $push: { replyList: { creator: params.creator, content: params.content } } })
        .catch(e => {
            throw new Error('fail to reply a topic')
            console.log(e)
        })
}

async function likeTopic(topicId) {
    let topic = await topicModel.findOneAndUpdate({ _id: ObjectId }, { $inc: { likes: 1 } }, { field: { likes: 1 } })
    return topic.likes
}

async function dislikeTopic(topicId) {
    let topic = await topicModel.findOneAndUpdate({ _id: ObjectId }, { $inc: { likes: 0 } }, { field: { likes: 0 } })
    return topic.likes
}

async function likereply(topicId, replyId) {
    let topic = await topicModel.findOne({ 'replyList._id': replyId }, { "replyList._id": 1, "replyList.likes": 1 })
    let reply = topic.replyList.find(e => e._id.toString() === replyId.toString())
    reply += 1
    await topic.save()
    return reply.likes
}

async function dislikereply(topicId, replyId) {
    let topic = await topicModel.findOne({ 'replyList._id': replyId }, { "replyList._id": 1, "replyList.likes": 1 })
    let reply = topic.replyList.find(e => e._id.toString() === replyId.toString())
    reply -= 1
    await topic.save()
    return reply.likes
}

module.exports = {
    model: topicModel,
    createNewTopic,
    getTopic,
    getTopicById,
    updateTopicById,
    replyATopic
}