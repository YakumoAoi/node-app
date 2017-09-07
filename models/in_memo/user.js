let USER_ID_INIT = 10000
let users = []

class User {
    constructor(params) {
        if (!params.age || !params.name) throw new Error('age and name are both required')
        this.age = params.age
        this.name = params.name
        this._id = USER_ID_INIT++
    }
}

async function createNewUser(params) {
    const user = new User(params)
    users.push(user)
    return user
}
async function getUser(params) {
    return users
}
async function getUserById(userId) {
    return users.find(u => u._id === Number(userId))
}
async function updateUserById(userId, update) {
    let user = users.find(u => u._id === userId)
    if (update.name) user.name = update.name;
    if (update.age) user.age = update.age;
    return user
}

module.exports = {
    // model:User,
    createNewUser,
    getUser,
    getUserById,
    updateUserById
}