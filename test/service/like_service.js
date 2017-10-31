const User = require('../../models/mongoose/user')
const Topic = require('../../models/mongoose/topic')
const Like = require('../../models/mongoose/like')


async function likeTopic(userId, attachedId) {

}
async function likeReply(userId, attachedId) {

}
async function dislikeTopic(userId, attachedId) {

}
async function dislikeRely(userId, attachedId) {

}

module.exports = {
    likeReply,
    likeTopic,
    dislikeRely,
    dislikeTopic
}