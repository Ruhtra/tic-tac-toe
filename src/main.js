// Modules
import Game from './public/game.js'

import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { randomUUID } from 'crypto'

// import ngrok from 'ngrok';
// (async function() {
//   const url = await ngrok.connect({
//     proto: 'http',
//     addr: 4000,
//     authtoken: 'cKiDSqqLdMBRTu8VzFVq_2VBGTrwa7M7uN2G4ffmY3'
//     });
//   console.log(url)
// })();

// Variables
const PORT = 4000

const app = express();
const server = http.createServer(app);

app.use(express.static('src/public'));

    // Config ejs
    app.set('view engine', 'ejs');
    app.set('views', 'src/views');

    // Config io
    const io = new Server(server);

// Routes

app.get('/', (req, res) => {
    return res.render('index.ejs')
})

// Socket.io
io.on('connection', (socket) => {
    let room = 'room1' // HARD CODE
    // constructor
        console.log(`A user connected: ${socket.id}`)
        
        socket.emit('updateGame', game.updateGame)
        socket.emit('updateMessage', messages.getRoom(room))

        
    // Game
    socket.on('input', (id) => { game.input(id) })
    socket.on('reset', () => { game.reset() })


    // Message
    socket.on('insertMessage', (data) => {
        data['id'] = randomUUID()
        data['name'] = 'playerOne' // HARD CODE

        messages.add(room, data)

        io.emit('updateMessage', messages.getRoom(room))
    })
});

// Server
server.listen(PORT, () => {
    console.log(` >. Server running in: ${PORT}`)
})

// Game
const game = new Game()
game.subscribe((command) => {
    if (command.type == 'input') io.emit('updateGame', game.updateGame)
    if (command.type == 'resetGame') io.emit('updateGame', game.updateGame) 

    console.log(`> Emmiting ${command.type}`)
})

// Message
const messages = new class Messages {
    #observers
    constructor() {
        this.messages = {}

        this.template = (data) => {
            return {
                id: data.id,
                name: data.name,
                text: data.text
            }
        }
        this.#observers = []
    }

    // Observer functions
    subscribe (observerFunction) {
        this.#observers.push(observerFunction)
    }
    #notifyAll (command) {
        for (const observerFunction of this.#observers) {
            observerFunction(command)
        }
    }

    add(room, data) {
        if (this.messages[room] == undefined) this.messages[room] = []
        this.messages[room].push(this.template(data))

        this.#notifyAll({
            type: 'add',
            room: room
        })
    }

    get getAll() { return this.messages }
    getRoom(room) { return this.messages[room] }
}
messages.subscribe((command) => {
    if (command.type == 'add') io.emit('updateMessage', messages.getRoom(command.room))
    
    console.log(`> Emmiting ${command.type}`)
})