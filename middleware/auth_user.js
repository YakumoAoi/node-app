const JWT = require('jsonwebtoken')
const JWT_SECRET = require('../ciphers').JWT_SECRET

module.exports = function(options) {
    return function(req, res, next) {
        (async() => {
            const auth = req.get('Authorization').split(' ')
            if (!auth || auth.length < 2) {
                next(new Error('No Auth!'))
            }
            const token = auth[1]
            const obj = JWT.verify(token, JWT_SECRET)
            if (!obj || !obj._id || !obj.expire) throw new Error('No Auth!')
            if (Date.now() - obj.expire > 0) throw new Error('token expire')
        })()
        .then(r => {
                next()
            })
            .catch(e) {
                res.statusCode = 401
                next(e)
            }
    }
}