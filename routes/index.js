const express = require('express');
const router = express.Router();
const User = require('../models/mongoose/user')
const JWT = require('jsonwebtoken')
const JWT_SECRET = require('../ciphers').JWT_SECRET
    /* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
    (async() => {
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
module.exports = router;