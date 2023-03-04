// Modules
import SaveRoom from './modules/SaveRoom.js'

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

function getRoomUrl(url) {
    return url.split('/')[4]
}

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
app.get('/game/:room', (req, res) => {
    let room = req.params.room
    if (saveRoom.getRoom(room) == undefined) saveRoom.new(room)
    if (saveRoom.getRoom(room).players.length >= 2) return res.status(401).json({msg: 'Busy room '});

    return res.render('index.ejs')
})

// Socket.io
io.on('connection', (socket) => {
    // constructor
        console.log(`A user connected: ${socket.id}`)
        
        let room = getRoomUrl(socket.handshake.headers.referer)
        saveRoom.new(room)
        saveRoom.addPlayer(room, socket.id, 'player')
        
        socket.join(room)
        socket.emit('updateMessage', saveRoom.getRoom(room).messages.getAll)
        io.to(room).emit('updateGame', {state: saveRoom.getRoom(room).game.updateGame, players: saveRoom.getIdPlayers(room)})

        socket.on("disconnect", () => {
            console.log(`A user disconnected: ${socket.id}`)
            saveRoom.delPlayer(room, socket.id)
    
            if (saveRoom.getRoom(room).players.length <= 0) {
                saveRoom.del(room)
            }
        })

    // Game
    socket.on('input', (id) => {
        let iPlayer = saveRoom.getIdPlayer(room, socket.id)
        if (saveRoom.getRoom(room).game.getTurn %2 != iPlayer) return console.log('Input não é permitido por esse player')
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
});

// Server
server.listen(PORT, () => { console.log(` >. Server running in: ${PORT}`) })

// Room
const saveRoom = new SaveRoom(io)