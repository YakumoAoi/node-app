const mongoose = require('mongoose')
const schema = mongoose.Schema

const topicSchema = new schema({
    creator: { type: String },
    title: { type: String },
    content: { type: String },
    replyList: { type: Array }
})
topicSchema.index({ _id: 1 })
const topicModel = mongoose.model('topics', topicSchema)

async function createNewTopic(params) {
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
            throw new Error('update topic by id failed')
            console.log(e)
        })
}
async function replyATopic(params) {
    if (!params.topicId) throw new Error('fail to get topic by id')
    if (!params.creator) throw new Error('fail to get user')
    if (!params.content.length < 5) throw new Error('content must have more than five words')
    return await topicModel.update({ _id: params.topicId }, { $push: { replyList: { creator: params.creator, content: params.content } } })
        .catch(e => {
            throw new Error('fail to reply a topic')
            console.log(e)
        })
}
module.exports = {
    model: topicModel,
    createNewTopic,
    getTopic,
    getTopicById,
    updateTopicById,
    replyATopic
}