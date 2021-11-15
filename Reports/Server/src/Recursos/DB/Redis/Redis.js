const redis = require('redis')
const client = redis.createClient("http://35.232.18.26:6379");

client.on('connect',function (){
    try {
        console.log('connected to redis')
    } catch (e) {
        console.log('Error de conexion con redis')
    }
    
});

module.exports = client