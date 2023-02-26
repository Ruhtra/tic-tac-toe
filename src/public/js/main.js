import Game from '../game.js'
import { EngineGame } from './modules/main/EngineGame.js';
import { ListenInput } from './modules/main/ListenInput.js'
import { Messages } from './modules/main/Messages.js'


const game = new Game()
const socket = new io()

const engineGame = new EngineGame(game)
new ListenInput(socket, game)

const messages = new Messages(document.querySelector('#messages'), 'playerOne')

// Sockets
socket.on('updateGame', (state) => {
    game.game = state.game
    game.turn = state.turn
    game.history = state.history

    engineGame.loadGame()
})

socket.on('updateMessage', (listMessages) => {
    messages.loadMessages(listMessages)
})