const mongoose = require('mongoose')
const schema = mongoose.Schema

const UserSchema = new schema({
    name: { type: String, require: true },
    age: { type: Number }
})

UserSchema.index({ name: 1 }, { unique: true })
const UserModel = mongoose.model('user', UserSchema)

async function createNewUser(params) {
    const user = new UserModel({ name: params.name, age: params.age })
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

module.exports = {
    model: UserModel,
    createNewUser,
    getUser,
    getUserById,
    updateUserById
}