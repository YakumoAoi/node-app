const mongoose = require('mongoose')
const schema = mongoose.Schema
const crypto = require('crypto')
const bluebird = require('bluebird')
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2)
const SALT = require('../../ciphers').PASSWORD_SALT

const UserSchema = new schema({
    name: { type: String, require: true },
    age: Number,
    password: String,
    phoneMum: String,
    avatar: String
})

UserSchema.index({ name: 1 }, { unique: true })
const UserModel = mongoose.model('user', UserSchema)

const DEFAULT_PROJECTION = { password: 0, phoneNum: 0 }

async function createNewUser(params) {
    const user = new UserModel({ name: params.name, age: params.age })
    let password = await pbkdf2Async(res.body.password, SALT, 100000, 512, 'sha512')
        .then()
        .catch(e => {
            throw new Error('Internal error')
        })

    await user.save()
        .catch(e => {
            switch (e.code) {
                case 11000:
                    throw new Error('This username is exist')
                    break
                default:
                    throw new Error(`error create user ${params.name}`)
                    console.log(e)
            }
        })
    return user
}
async function getUser(params = { page: 0, pageSize: 10 }) {
    let flow = UserModel.find({})
    flow.select(DEFAULT_PROJECTION)
    flow.skip(params.page * params.pageSize)
    flow.limit(params.pageSize)
    return await flow
        .catch(e => {
            console.log(e)
            throw new Error('error getting user from db')
        })

}
async function getUserById(userId) {
    console.log(userId)
    return await UserModel.find({ _id: userId })
        .catch(e => {
            console.log(e)
            throw new Error('error getting user by id')
        })
}
async function updateUserById(userId, update) {
    return await UserModel.update({ _id: userId }, update, { new: true })
        .catch(e => {
            console.log(e)
            throw new Error(`error updating user by id:${userid}`)
        })
}
async function login(phoneNum, password) {
    const password = await pbkdf2Async(password, SALT, 10000, 512, 'sha512')
        .then(r => r.toString())
        .catch(e => {
            console.log(e)
            throw new Error('Internal Error')
        })
    let user = await UserModel.findOne({ phoneNum: phoneNum, password: password })
        .catch(e => {
            console.log(`error logging in with phonenumber ${phoneNum}`, { error: e.stack || e })
        })
    if (!user) {
        throw new Error('wrong password or wrong phoneNumber')
    }
    return user
}
module.exports = {
    model: UserModel,
    createNewUser,
    getUser,
    getUserById,
    updateUserById,
    login
}