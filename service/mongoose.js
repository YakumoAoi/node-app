const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27100,localhost:27101,localhost:27102/node_app?replicaSet=mg_replica_set'

mongoose.Promise = global.Promise


mongoose.connect(uri, {
    useMongoClient: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('connected')
})