const express = require('express')
const router = express.Router()
const MsgService = require('../service/message_service')
const response = require('../util/reponse')

router.route('/')
    .get((req, res, next) => {
        (async() => {
            let user = await User.getUserById(req.body.userId)
            const userId = user._id
            const page = Number(req.query.page) || 0
            const pageSize = Number(req.query.pageSize) || 0
            const msgs = await MsgService.getUserReceivedMsgs({
                userId,
                page,
                pageSize
            })
            return {
                code: 0,
                msgs
            }
        })()
        .then(r => {
                res.data = r
                response(req, res)
            })
            .catch(e => {
                res.err = e
                response(req, res)
            })
            .post((req, res, next) => {
                (async() => {
                    let user = await User.getUserById(req.body.userId)
                    const { to, content } = req.body
                    const msg = await MsgService.sendMsgByUser(user._id, to, content)
                    return {
                        code: 0,
                        msg,
                    }
                })()
                .then(r => {
                        res.data = r
                        response(req, res, next)
                    })
                    .catch(e => {
                        res.next(e)
                    })
            })
    })

module.exports = router