const express = require('express');
const router = express.Router();
const User = require('../models/mongoose/user')
const JWT = require('jsonwebtoken')
const JWT_SECRET = require('../ciphers').JWT_SECRET
const Errors = require('../error')
const PointService = require('../service/point_service')
const response = require('../util/reponse')

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
    (async() => {
        if (!req.body.password) throw new Errors.ValidationError('password', 'password can not be empty')
        if (typeof req.body.password !== 'string') throw new Errors.ValidationError('password', 'password must be a string')
        if (req.password.length < 8) throw new Errors.ValidationError('password', 'password must longer than 8 letters')
        if (req.password.length > 32) throw new Errors.ValidationError.apply('passowrd', 'password on longer more than 32 letters')
        const user = await User.login(req.body.phoneNum, req.body.password)
        const token = JWT.sign({ _id: user._id, iat: Date.now(), expire: Date.now() + 1000 * 60 * 60 * 24 }, JWT_SECRET)
        return ({
            code: 0,
            data: {
                user: user,
                token: token
            }
        })
    })()
    .then(r => {
            res.json(r)
        })
        .catch(e => {
            next(e)
        })
})

router.get('/pointRank', (req, res, next) => {
    (async() => {
        const users = await PointService.getPointRankBrief()
        return {
            code: 0,
            users,
        }
    })()
    .then(r => {
            res.data = r
            response(req, res)
        })
        .catch(e => {
            next(e)
        })
})
module.exports = router;