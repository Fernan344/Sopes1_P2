import io from 'socket.io-client'

let socket = io(`//104.196.205.32:4000`, { transports : ['websocket']})

export default socket;