const express = require('express');
const router = express.Router();

const User = require('../models/mongoose/user')
const Topic = require('../models/mongoose/topic')
const likeService = require('../service/like_service')
const response = require('../util/reponse')

//get/post topic
router.route('/')
    .get((req, res, next) => {
        (async() => {
            let topics = await Topic.getTopic()
            return {
                code: 0,
                topics: topics
            }
        })()
        .then(r => {
                res.json(r)
            })
            .catch(e => {
                next(e)
            })
    })
    .post((req, res, next) => {
        (async() => {
            let user = await User.getUserById(req.body.userId)
            let topic = await Topic.createNewTopic({
                creator: user,
                title: req.body.title,
                content: req.body.content
            })
            return {
                code: 0,
                topic: topic
            }
        })()
        .then(r => {
                res.json(r)
            })
            .catch(e => {
                next(e)
            })
    })

//get/modefied topic by id
router.route('/:id')
    .get((req, res, next) => {
        (async() => {
            let topic = await Topic.getTopicById(req.params.id)
            return {
                code: 0,
                topic: topic
            }
        })()
        .then(r => {
                res.json(r)
            })
            .catch(e => {
                next(e)
            })
    })
    .patch((req, res, next) => {
        (async() => {
            let user = await User.getUserById(req.body.userId)
            let topic = await Topic.updateTopicById(req.params.id, {
                creator: user,
                title: req.body.title,
                content: req.body.content
            })
            return {
                code: 0,
                topic: topic
            }
        })()
        .then(r => {
                res.json(r)
            })
            .catch(e => {
                next(e)
            })
    })
router.route('/:id/like')
    .patch((req, res, next) => {
        (async() => {
            let user = await User.getUserById(req.body.userId)
            await likeService.likeTopic(user._id, req.param.id)
            return {
                code: 0
            }
        })()
        .then(r => {
                res.data = r
                response(req, res, next)
            })
            .catch(e => {
                next(e)
            })
    })
    .delete((req, res, next) => {
        (async() => {
            let user = await User.getUserById(req.body.userId)
            await likeService.likeTopic(user._id, req.param.id)
            return {
                code: 0
            }
        })()
        .then(r => {
                res.data = r
                response(req, res, next)
            })
            .catch(e => {
                next(e)
            })
    })
router.route('/:id/reply')
    .post((req, res, next) => {
        (async() => {
            let user = await User.getUserById(req.body.userId)
            let topic = await Topic.replyATopic({
                topicId: req.params.id,
                creator: user,
                content: req.body.content
            })
            return {
                code: 0,
                topic: topic
            }
        })()
        .then(r => {
                res.json(r)
            })
            .catch(e => {
                next(e)
            })
    })
router.route('/:id/reply/:replyId/like')
    .patch((req, res, next) => {
        (async() => {
            let user = await User.getUserById(req.body.userId)
            await likeService.likeReply(user._id, req.param.replyId)
            return {
                code: 0
            }
        })()
        .then(r => {
                res.data = r
                response(req, res, next)
            })
            .catch(e => {
                next(e)
            })
    })
    .delete((req, res, next) => {
        (async() => {
            let user = await User.getUserById(req.body.userId)
            await likeService.dislikeReply(user._id, req.param.replyId)
            return {
                code: 0
            }
        })()
        .then(r => {
                res.data = r
                response(req, res, next)
            })
            .catch(e => {
                next(e)
            })
    })


module.exports = router;