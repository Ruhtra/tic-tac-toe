const { Game } = require("./game.js");
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");

// const ngrok = require('ngrok');
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

var games = {

}

// error, 3º player conectado altera o id do p2
function addGame(room, id) {
    if (room == '') return 'vazio'

    if (games[room] == undefined) {
        games[room] = new Game()
        games[room][id] = 1
    } else {
        games[room][id] = 2
    }
}


// Config server
const app = express();
const server = http.createServer(app);

app.use(express.static('src/public'));

    // Config ejs
    app.set('view engine', 'ejs');
    app.set('views', 'src/views');

    // Config io
    const io = new Server(server);

// Routes
app.get('/game/:room', (req, res) => {
    res.render('./index.ejs')
})
app.get('/', (req, res) => {
    res.render('./login.ejs')
})

// Socket.io
io.on('connection', (socket) => {
    // constructor
        console.log(`A user connected: ${socket.id}`)
        
        // obtem a sala e cria o game
        var room = socket.handshake.headers.referer.split('/')[3]
        addGame(room, socket.id)
        
        socket.join(room)

    socket.on('insert', (pos, callback) => {
        if (games[room].getRound %2 == 0) games[room].insert({pos: pos, player: 1})
        else games[room].insert({pos: pos, player: 2})

        io.to(room).emit('updateGame', games[room].getTable)
        callback('ok')
    })

    socket.on('getTable', (callback) => {
        console.log(games[room])
        callback(games[room].getTable)
    })
    socket.on('getPlayer', (callback) => {
        callback(games[room][socket.id])
    })
    socket.on('getRound', (callback) => {
        callback(games[room].getRound)
    })
});

// Server
server.listen(PORT, () => {
    console.log(` >. Server running in: ${PORT}`)
})

// var game = new Game()
// game.insert({pos: 0, player: 1})
// console.log(game.getTable)

// var r = game.verify()
// if (r != undefined) {
//     if ('tied') console.log('Velha!')
//     else console.log(`${r} win!`)
// }