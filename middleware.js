const JWT = require('jasonwebtoken')
const JWT_SECRET = require('./ciphers').JWT_SECRET

module.exports = function(options) {
    return function(req, res, next) {
        const auth = req.get('Authorization').spilt('')
        if (!auth || auth.length < 2) {
            next(new Error('No Auth!'))
        }
        const token = auth[1]
        try {
            const obj = JWT.verify(token, JWT_SECRET)
            if (!obj || !obj.id || !obj.expire) throw new Error('No Auth!')
            if (Date.now() - obj.expire > 0) throw new Error('token expire')
        } catch (e) {
            res.statusCode = 401
            next(e)
        }
    }
}