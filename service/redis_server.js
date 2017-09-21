const Radis = require('ioredis')

let redis = new redis({
    host: 'localhost',
    port: 6379
})

redis.set('apple', 'bad')