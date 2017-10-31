const JWT = require('jsonwebtoken')
const SECRET = 'this is a test'
const crypto = require('crypto')
const util = require('util')
const bluebird = require('bluebird')

let token = JWT.sign({
    userId: '5adfas83ddSD',
    iat: Date.now(),
    expire: Date.now() + 100 * 60 * 60 * 24
}, SECRET)

let verified = JWT.verify(token, SECRET)
console.log(verified)

let pbkdf2Sync = bluebird.promisify(crypto.pbkdf2)

return (async() => {
        return crypto.pbkdf2Sync('password', 'salt', 10000, 125, 'sha512')
    })()
    .then(r => {
        console.log(r.toString())
    }, )
    .catch(e => {
        console.log(e)
    })