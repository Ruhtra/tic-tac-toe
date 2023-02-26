// Modules
import Game from './public/game.js'

import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { randomUUID } from 'crypto'
import { Messages } from './Messages.js'

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

        saveRoom.addPlayer(room, socket.id, 'player1')
        
    // Game
    socket.on('input', (id) => { game.input(id) })
    socket.on('reset', () => { game.reset() })


    // Message
    socket.on('insertMessage', (data) => {
        data['id'] = randomUUID()
        data['name'] = saveRoom.getPlayer(room, socket.id).name

        messages.add(room, data)

        io.emit('updateMessage', messages.getRoom(room))
    })

    socket.on("disconnect", () => {
        saveRoom.delPlayer(room, socket.id)
        console.log(`A user disconnected: ${socket.id}`)
    })
});

// Server
server.listen(PORT, () => { console.log(` >. Server running in: ${PORT}`) })

// Room
const saveRoom = new class saveRoom {
    #template
    constructor() {
        this.rooms = {}
        this.#template = {
            players: []
        }
    }
    new(room) {
        if (this.rooms[room] == undefined) return this.rooms[room] = this.#template
        console.log('Sala ja criada')
    }
    addPlayer(room, id, name) {
        this.rooms[room].players.push({id, name})
    }
    delPlayer(room, id) {
        let iElement = this.rooms[room].players.findIndex(e => e.id == id)
        if (iElement >= 0) this.rooms[room].players.splice(iElement, 1)
    }

    getPlayer(room, id) {
        return this.rooms[room].players.find(e => e.id == id)
    }
}
saveRoom.new('room1')

// Game
const game = new Game()
game.subscribe((command) => {
    if (command.type == 'input') io.emit('updateGame', game.updateGame)
    if (command.type == 'resetGame') io.emit('updateGame', game.updateGame) 

    console.log(`> Emmiting ${command.type}`)
})

// Message
const messages = new Messages()
messages.subscribe((command) => {
    if (command.type == 'add') io.emit('updateMessage', messages.getRoom(command.room))
    
    console.log(`> Emmiting ${command.type}`)
})