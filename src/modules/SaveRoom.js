import Game from '../public/game.js'
import { Messages } from '../modules/Messages.js'

export default class SaveRoom {
    #template
    constructor(io) {
        this.rooms = {}
        this.#template = {
            players: []
        }
        this.io = io
    }
    new(room) {
        if (this.rooms[room] != undefined) return console.log('Room already exists')
        this.rooms[room] = this.#template

        // Game
        this.getRoom(room).game = new Game()
        let roomgame = this.getRoom(room).game
        roomgame.subscribe((command) => {
            if (command.type == 'input') this.io.to(room).emit('updateGame', {state: roomgame.updateGame, players: this.getIdPlayers(room)})
            if (command.type == 'resetGame') this.io.to(room).emit('updateGame', {state: roomgame.updateGame, players: this.getIdPlayers(room)})

            console.log(`> Emmiting Game ${command.type}`)
        })

        // Message
        this.getRoom(room).messages = new Messages()
        let roomMessage = this.getRoom(room).messages
        roomMessage.subscribe((command) => {
            if (command.type == 'add') this.io.to(room).emit('updateMessage', roomMessage.getAll)

            console.log(`> Emmiting Message ${command.type}`)
        })
    }
    del(room) {
        console.log('delete room'+room) // IMPLEMENT
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
    getIdPlayers(room) { return this.rooms[room].players.map(e => e.id) }
}