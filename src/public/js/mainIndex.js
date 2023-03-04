import { EngineGame } from './modules/main/EngineGame.js';
import { ListenInput } from './modules/main/ListenInput.js'
import { Messages } from './modules/main/Messages.js'

import { getCookie } from './functions.js'

import Game from './game/game.js'

const room = location.pathname.split('/')[2]

const game = new Game()
const socket = new io('http://localhost:4000', {query: `username=${getCookie('username')}&room=${room}`})
const messages = new Messages(document.querySelector('#messages'), getCookie('username'))

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