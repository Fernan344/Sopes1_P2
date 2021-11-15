var MongoClient = require ('mongodb').MongoClient; 

const uri = 'mongodb://35.185.104.25:27017/proyecto2'

const client = new MongoClient(uri);

module.exports = client