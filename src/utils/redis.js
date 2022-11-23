const redis = require('redis');

const redisInfo = {
    host: '52.78.198.181',
    port : 6379,
    password: '!123456@'
}
let redisClient

process.env.NODE_ENV ==="development"
    ? redisClient = redis.createClient(process.env.REDIS_PORT)
    : redisClient = redis.createClient(redisInfo);


// const redisClient = redis.createClient(process.env.REDIS_PORT);

redisClient.connect();

module.exports = redisClient;