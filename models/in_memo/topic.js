let TOPIC_ID_INIT = 20000
let topics = []

class Topic {
    constructor(params) {
        if (!params.creator) throw { code: -1, msg: 'topics must send by users' }
        if (!params.title) throw { code: -1, msg: 'a topic must have a title' }
        if (params.content.length < 5) throw { code: -1, msg: 'a topic must have contain more than 5 letters' }
        this._id = TOPIC_ID_INIT
        TOPIC_ID_INIT += 1
        this.creator = params.creator
        this.title = params.title
        this.content = params.content
        this.replyList = []
    }
}

async function createNewTopic(params) {
    const topic = new Topic(params)
    topics.push(topic)
    return topic
}
async function getTopic(params) {
    return topics
}
async function getTopicById(topicId) {
    return topics.find(t => t._id === topicId)
}
async function updateTopicById(topicId, update) {
    let topic = topics.find(t => t._id === topicId)
    console.log(topic)
    if (update.title) topic.title = update.title;
    if (update.content) topic.content = update.content;
    return topic
}
async function replyATopic(params) {
    let topic = topics.find(t => t._id === Number(params.topicId))
    console.log(params)
    topic.replyList.push({
        creator: params.creator,
        content: params.content
    })
    return topic
}
module.exports = {
    // model: Topic,
    createNewTopic,
    getTopic,
    getTopicById,
    updateTopicById,
    replyATopic
}