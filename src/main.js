// Modules
import SaveRoom from './modules/SaveRoom.js'
import socketGame from './modules/sockets/socketGame.js'
import socketMessage from './modules/sockets/socketMessage.js'

import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from "cookie-parser";

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
    // Config cors
    app.use(cors())

    // Config cookies
    app.use(cookieParser())

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
        let username = req.cookies.username || undefined

        if (username == undefined) return res.status(401).json({msg: 'Username not found'})

        if (saveRoom.getRoom(room) == undefined) return res.render('index.ejs')
        if (saveRoom.getRoom(room).players.length >= 2) return res.status(401).json({msg: 'Busy room'});

        return res.render('index.ejs')  
    })

    // Api
    app.use('/api/verifyFullRoom/:room', (req, res) => {
        let room = req.params.room
        if (saveRoom.getRoom(room) == undefined) return res.json({msg: 'Room okay'})
        console.log(saveRoom.getRoom(room).players.length >= 2)
        saveRoom.getRoom(room).players.length >= 2 ? res.json({msg: 'Busy room'}) : res.json({msg: 'Room okay'})
    })

// Socket.io
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`)
    // constructor
        let room = socket.request._query['room']
        let username = socket.request._query['username']

        socket.join(room)

        saveRoom.new(room, io)
        saveRoom.getRoom(room).addPlayer(socket.id, username)

        socket.emit('updateMessage', saveRoom.getRoom(room).messages.getAll)
        io.to(room).emit('updateGame', {
            state: saveRoom.getRoom(room).game.updateGame,
            players: saveRoom.getRoom(room).getIdPlayers()
        })

        socket.on("disconnect", () => {
            console.log(`A user disconnected: ${socket.id}`)
            saveRoom.getRoom(room).delPlayer(socket.id)

            if (saveRoom.getRoom(room).players.length <= 0)  saveRoom.del(room)
        })
    
    socketGame(socket, saveRoom.getRoom(room))
    socketMessage(socket, saveRoom.getRoom(room))
});

// Server
server.listen(PORT, () => { console.log(` >. Server running in: ${PORT}`) })

// Room
const saveRoom = new SaveRoom(io)