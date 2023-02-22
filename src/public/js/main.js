import Game from '../game.js'
import { EngineGame } from './modules/main/EngineGame.js';
import { ListenInput } from './modules/main/ListenInput.js'
import { Messages } from './modules/main/Messages.js'


const game = new Game()
const socket = new io()

const engineGame = new EngineGame(game)
new ListenInput(socket, game)


const messages = new Messages(socket, document.querySelector('#messages'))
messages.add({id: 0, name: 'PlayerOne', text: 'Esse é um texto teste parar ser adicionado'})
messages.add({id: 1, name: 'PlayerTwo', me:true, text: 'Second4'})

// Sockets
socket.on('updateGame', (state) => {
    game.game = state.game
    game.turn = state.turn
    game.history = state.history

    engineGame.loadGame()
})