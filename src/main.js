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
    return res.render('login.ejs')
})
app.get('/:room', (req, res) => {
    let room = /*req.params.room*/ 'room1'
    if (saveRoom.getRoom(room).players.length >= 2) return res.status(401).json({msg: 'Busy room '});

    return res.render('index.ejs')
})

// Socket.io
io.on('connection', (socket) => {
    let room = 'room1' // HARD CODE
    // constructor
        console.log(`A user connected: ${socket.id}`)
        
        socket.emit('updateGame', saveRoom.getRoom(room).game.updateGame)
        socket.emit('updateMessage', saveRoom.getRoom(room).messages.getAll)

        saveRoom.addPlayer(room, socket.id, 'player')
        
    // Game
    socket.on('input', (id) => {
        let iPlayer = saveRoom.getIdPlayer(room, socket.id)
        if (saveRoom.getRoom(room).game.getTurn %2 != iPlayer) return console.log('Input não é permitido')
        saveRoom.getRoom(room).game.input(id)
    })
    socket.on('reset', () => { saveRoom.getRoom(room).game.reset() })


    // Message
    socket.on('insertMessage', (data) => {
        data['id'] = randomUUID()
        data['name'] = saveRoom.getPlayer(room, socket.id).name

        saveRoom.getRoom(room).messages.add(data)

        io.emit('updateMessage', saveRoom.getRoom(room).messages.getAll)
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
        if (this.rooms[room] != undefined) return console.log('Room already exists')
        this.rooms[room] = this.#template

        // Game
        this.getRoom(room).game = new Game()
        let roomgame = this.getRoom(room).game
        roomgame.subscribe((command) => {
            if (command.type == 'input') io.emit('updateGame', roomgame.updateGame)
            if (command.type == 'resetGame') io.emit('updateGame', roomgame.updateGame)

            console.log(`> Emmiting ${command.type}`)
        })

        // Message
        this.getRoom(room).messages = new Messages()
        let roomMessage = this.getRoom(room).game
        roomMessage.subscribe((command) => {
            if (command.type == 'add') io.emit('updateMessage', roomMessage.getAll)

            console.log(`> Emmiting ${command.type}`)
        })
    }
    addPlayer(room, id, name) {
        this.rooms[room].players.push({id, name})
    }
    delPlayer(room, id) {
        let iElement = this.rooms[room].players.findIndex(e => e.id == id)
        if (iElement >= 0) this.rooms[room].players.splice(iElement, 1)
    }

    getPlayer(room, id) { return this.rooms[room].players.find(e => e.id == id) }
    getIdPlayer(romm, id) {return this.rooms[romm].players.findIndex(e => e.id == id)}
    getRoom(room) { return this.rooms[room] }
}
saveRoom.new('room1') // HARD CODE