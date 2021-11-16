import io from 'socket.io-client'

let socket = io(`//backend:4000`, { transports : ['websocket']})

export default socket;