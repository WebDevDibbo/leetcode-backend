

const {createClient} = require("redis");

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,   
    socket: {
        host: 'redis-12035.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 12035
    }
});


module.exports = redisClient;