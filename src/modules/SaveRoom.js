import Game from '../public/game.js'
import Messages from '../modules/Messages.js'

class Room {
    constructor(room, io) {
        this.players = []
        this.io = io

        // Game
        this.game = new Game()
        let roomgame = this.game
        roomgame.subscribe((command) => {
            if (command.type == 'input') this.io.to(room).emit('updateGame', {state: roomgame.updateGame, players: this.getIdPlayers()})
            if (command.type == 'resetGame') this.io.to(room).emit('updateGame', {state: roomgame.updateGame, players: this.getIdPlayers()})

            console.log(`> Emmiting Game ${command.type}`)
        })

        // Message
        this.messages = new Messages()
        let roomMessage = this.messages
        roomMessage.subscribe((command) => {
            if (command.type == 'add') this.io.to(room).emit('updateMessage', roomMessage.getAll)

            console.log(`> Emmiting Message ${command.type}`)
        })
    }

    addPlayer(id, name) { this.players.push({id, name}) }
    delPlayer(id) {
        let iElement = this.players.findIndex(e => e.id == id)
        if (iElement >= 0) this.players.splice(iElement, 1)
    }

    // Getters
    getPlayer(id) { return this.players.find(e => e.id == id) }
    getIdPlayer(id) { return this.players.findIndex(e => e.id == id) }
    getIdPlayers() { return this.players.map(e => e.id) }
}

export default class SaveRoom {
    constructor() {
        this.rooms = {}
    }
    new(room, io) {
        if (this.rooms[room] != undefined) return console.log('Room already exists')
        this.rooms[room] = new Room(room, io)
    }
    del(room) {
        if (this.rooms[room] == undefined) return console.log('The room does not exist')
        delete this.rooms[room]
    }

    // Getters
    getRoom(room) { return this.rooms[room] }
}