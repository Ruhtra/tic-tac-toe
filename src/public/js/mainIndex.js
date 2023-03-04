import Game from './game/game.js'
import { EngineGame } from './modules/main/EngineGame.js';
import { ListenInput } from './modules/main/ListenInput.js'
import { Messages } from './modules/main/Messages.js'


const game = new Game()
const socket = new io()
const messages = new Messages(document.querySelector('#messages'), 'playerOne')

const engineGame = new EngineGame(game)
new ListenInput(socket, game)


// Sockets
socket.on('updateGame', ({state, players}) => {
    game.game = state.game
    game.turn = state.turn
    game.history = state.history

    engineGame.loadGame({iPlayer: players.indexOf(socket.id)})
})

socket.on('updateMessage', (listMessages) => {
    messages.loadMessages(listMessages)
})