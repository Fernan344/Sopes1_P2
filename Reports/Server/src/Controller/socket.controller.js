const socketClass = require('../Recursos/Socket');
const client = require('../Recursos/DB/Mongo/Mongo')
const redis = require('../Recursos/DB/Redis/Redis');
const session = require('sessionstorage')

var registrosMongo = 0; 
var registrosRedis = 0;

exports.verificacion = async () => {
    socket = socketClass.getSocket();       
    session.setItem("valoresRedis", [])
    
    registrosMongo = await getTotalMongo();
    registrosRedis = session.getItem("valoresRedis").length;

    socket.on('connection', (socket) => {    
        
        socket.on('verificar', async (msg)  => {
            let actualesMongo = await getTotalMongo();
            await getTotalRedis()
            let actualesRedis = session.getItem("valoresRedis").length;
            socket.emit('verificado', await obtenerReportes(msg))

            console.log(actualesMongo+"-"+actualesRedis)
           // if(actualesMongo!=registrosMongo || actualesRedis!=registrosRedis){
                registrosRedis=actualesRedis;
                registrosMongo=actualesMongo;
                socket.emit('verificado', await obtenerReportes(msg))
           /* }else{
                socket.emit('verificado', {isData: false})
            }*/
        })
    })
}

async function getTotalMongo(){
    await client.connect();
    const database = client.db("proyecto2");
    const collection = database.collection("logs");

    // Query for a movie that has the title 'The Room'
    const queryTweets = {};
    const optionsTweets = {};

    return await collection.find(queryTweets, optionsTweets).count();
}

function sortResults(arr, prop, asc) {
    let data = arr;
    data.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    return data;
}

async function getTotalRedis(){
    await redis.LRANGE("datos", 0, -1, await function (err, data) {
        let newData = []
        data.map(dato=>{
            let newDato = JSON.parse((dato))
            newData.push({request_number: parseInt(newDato.request_number), game: parseInt(newDato.game),
                gamename: newDato.gamename, winner: parseInt(newDato.winner), players: parseInt(newDato.players), worker: newDato.worker})
        })    
        session.setItem("valoresRedis", newData)       
    });
}

function reporte1(arreglo){   

    let jugadores = 0
    let juegos = []
    arreglo.map(reg => {
        jugadores = jugadores + reg.players

        if(!juegos.includes(reg.game)) juegos.push(reg.game)
    })

    return [arreglo.length, jugadores, juegos.length]
}

function reporte2(arreglo){
    let data = sortResults(arreglo, 'request_number', false)

    let retorno = []
    for(var i=0; i<10; i++){
        if(i==data.length)break
        let array = [data[i].game, data[i].gamename, data[i].winner, data[i].players]
        retorno.push(array)
    }
    return retorno
}

function reporte3(arreglo){
    let winners=[]
    let jsonWinners=[]
    arreglo.map(reg => {
        let number = parseInt(reg.winner)
        if(!winners.includes(number)){
            winners.push(number)
            jsonWinners.push({winner: number, wins: 1})
        }else{
            var pos = winners.indexOf(number)
            if(pos!=-1)
            jsonWinners[pos].wins = jsonWinners[pos].wins + 1   
        }
    })
    let retorno = []

    let data = sortResults(jsonWinners, 'wins', false)

    for(var i=0; i<10; i++){
        if(i==data.length)break
        let array = [data[i].winner, data[i].wins]
        retorno.push(array)
    }
    return retorno
}

function reporte4(arreglo, player){
    let winners=[]
    let jsonWinners=[]
    arreglo.map(reg => {
        let number = parseInt(reg.winner)
        if(!winners.includes(number)){
            winners.push(number)
            jsonWinners.push({winner: number, wins: 1})
        }else{
            var pos = winners.indexOf(number)
            if(pos!=-1)
            jsonWinners[pos].wins = jsonWinners[pos].wins + 1 
        }
    })
    let retorno = []
    if(player==undefined || player == null || player==""){
        jsonWinners.map(reg=>{
            let array = [reg.winner, reg.wins]
            retorno.push(array)
        })
    } else{
        var pos = winners.indexOf(parseInt(player))
        if(pos==-1){
           retorno=[[]]
        }else{
            retorno.push([jsonWinners[pos].winner, jsonWinners[pos].wins])
        }        
    }
    return retorno
}

function reporte5(arreglo){
    let retorno = []
    arreglo.map(reg=>{
        retorno.push([reg.request_number, reg.game, reg.gamename, reg.winner, reg.players, reg.worker])
    })
    return retorno
}

function reporte6(arreglo){
    let games=[]
    let jsonGames=[]
    arreglo.map(reg => {
        let number = parseInt(reg.game)
        if(!games.includes(number)){
            games.push(number)
            jsonGames.push({game: number, gamename: reg.gamename, plays: 1})
        }else if(games.includes(number)){
            var pos = games.indexOf(number)
            jsonGames[pos].plays = jsonGames[pos].plays + 1 
        }
    })
    let labels = []
    let data = []

    jsonGames.sort(function (a, b) {
        return a.plays + b.plays;
    });
    
    for(var i=0; i<3; i++){
        if(i==jsonGames.length)break
        labels.push(jsonGames[i].gamename)
        data.push(jsonGames[i].plays)
    }
    return {labels: labels, data: data}
}

function reporte7(arreglo){
    //[0] kafka [1] pub [2] rabbit
    let workers=[0, 0, 0]
    arreglo.map(reg => {
        if(reg.worker=="PubSub") workers[1] = workers[1] + 1
        else if(reg.worker=="Kafka") workers[0] = workers[0] + 1
        else workers[2] = workers[2] + 1
    })
    return workers
}

async function obtenerReportes(player){    
    await client.connect();
    const database = client.db("proyecto2");
    const collection = database.collection("logs");
    // Query for a movie that has the title 'The Room'
    const query = {};
    const options = {};
    let mongoRegisters = await collection.find(query, options).toArray();
    let redisRegisters = session.getItem("valoresRedis")

    let reporte6Mongo = reporte6(mongoRegisters)
    let reporte6Redis = reporte6(redisRegisters)

    return {
        isData: true,
        reporte1Columnas: {mongo: ["Registros", "Jugadores", "Jugados"], redis: ["Registros", "Jugadores", "Jugados"]},
        reporte2Columnas: {mongo: ["ID", "Juego", "Ganador", "Jugadores"], redis: ["ID", "Juego", "Ganador", "Jugadores"]},
        reporte3Columnas: {mongo: ["Jugador", "Juegos Ganados"], redis: ["Jugador", "Juegos Ganados"]},
        reporte4Columnas: {mongo: ["Jugador", "Juegos Ganados"], redis: ["Jugador", "Juegos Ganados"]},
        reporte5Columnas: {mongo: ["Request", "Game", "Gamen Name", "Winner", "Players", "Worker"], redis: ["Request", "Game", "Gamen Name", "Winner", "Players", "Worker"]},
        reporte6Labels: {mongo: reporte6Mongo.labels, redis: reporte6Redis.labels},
        reporte7Labels: {mongo: ["Kafka", "Pub/Sub", "RabbitMQ"], redis: ["Kafka", "Pub/Sub", "RabbitMQ"]},

        reporte1Data: {mongo: [reporte1(mongoRegisters)], redis: [reporte1(redisRegisters)]},
        reporte2Data: {mongo: reporte2(mongoRegisters), redis: reporte2(redisRegisters)},
        reporte3Data: {mongo: reporte3(mongoRegisters), redis: reporte3(redisRegisters)},
        reporte4Data: {mongo: reporte4(mongoRegisters, player), redis: reporte4(redisRegisters, player)},
        reporte5Data: {mongo: reporte5(mongoRegisters), redis: reporte5(redisRegisters)},
        reporte6Data: {mongo: reporte6Mongo.data, redis: reporte6Redis.data},
        reporte7Data: {mongo: reporte7(mongoRegisters), redis: reporte7(redisRegisters)}
    }  
}