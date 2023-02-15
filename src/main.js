// Modules
import Game from './public/game.js'

import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

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
    // constructor
        console.log(`A user connected: ${socket.id}`)
        
        socket.emit('updateGame', updateGame())

        socket.on('input', (id) => {
            game.input(id)
        })
        socket.on('reset', () => {
            game.reset()
        })
});

// Server
server.listen(PORT, () => {
    console.log(` >. Server running in: ${PORT}`)
})

// Game
const game = new Game()
const updateGame = () => { return { 
    game: game.getTable,
    round: game.getRound,
    gameActive: game.gameActive
}}
game.subscribe((command) => {
    if (command.type == 'input') io.emit('updateGame', updateGame())
    if (command.type == 'endGame') io.emit('endGame', command.state)
    if (command.type == 'resetGame') io.emit('updateGame', updateGame()) 

    console.log(`> Emmiting ${command.type}`)
})