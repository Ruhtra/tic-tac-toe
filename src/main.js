const { Game } = require("./game.js");
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");

// Variables
const PORT = 4000

var games = {

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
app.get('/', (req, res) => {


    res.render('./index.ejs', {player: 1})
})

// Socket.io
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`)
    games[socket.id] = new Game()

    socket.on('insert', (pos, callback) => {
        games[socket.id].insert({pos: pos, player: 1})
        callback('ok')
    })
    socket.on('getTable', (callback) => {
        callback(games[socket.id].getTable)
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