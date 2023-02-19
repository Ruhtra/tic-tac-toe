import Game from './game.js'
import { EngineGame } from './modules/main/EngineGame.js';
import { ListenInput } from './modules/main/ListenInput.js'


const game = new Game()
const socket = new io()

const engineGame = new EngineGame(game)
new ListenInput(socket, game)


// Sockets
socket.on('updateGame', (state) => {
    game.game = state.game
    game.turn = state.turn
    game.history = state.history

    engineGame.loadGame()
})