import Game from './game.js'
import { ListenInput } from './modules/main/ListenInput.js'

const ts = ['x', 'circle']  // TEMPLATE SIMBOLS { TEMP }

const game = new Game()
const socket = new io()


class EngineGame {
    loadGame() {
        // update in hovers
        if (game.turn %2 == 0) {
            this.addHover(ts[0])
            this.removeHover(ts[1])
        } else {
            this.addHover(ts[1])
            this.removeHover(ts[0])
        }

        // update in game
        game.game.forEach((e, i) => {
            this.unVisible(i, ts[0])
            this.unVisible(i, ts[1])
            if (e != null) this.visible(i, ts[e-1])
        })
    }

    endGame() {
        game.game.forEach((e, i) => {
            this.removeHover(ts[0])
            this.removeHover(ts[1])
        })
    }
}

class VisualGame extends EngineGame {
    constructor () {
        super()
        this.block = document.querySelector('main section#game')
    }
    addClass(element, className) {
        let string = element.getAttribute('class').split(' ')
        let newClass = string.filter((e) => e != className)
        newClass.push(className)

        element.setAttribute('class', newClass.join(' ').trim())
    }
    delClass(element, className) {
        let string = element.getAttribute('class').split(' ')
        let newClass = string.filter((e) => e != className).join(' ')

        element.setAttribute('class', newClass.trim())
    }

    addHover(type) {
        document.querySelectorAll('svg.'+type).forEach(e => {
            this.addClass(e, 'hover')
        })
    }
    removeHover(type) {
        document.querySelectorAll('svg.'+type).forEach(e => {
            this.delClass(e, 'hover')
        })
    }
    
    visible(id, type) {
        // adiciona class active
        let block = this.block.querySelector(`div#id_${id}`)
        this.addClass(block, 'active')
        
        // deixa objeto visivel
        this.delClass(block.querySelector('svg.'+type), 'hide')
    }
    unVisible(id, type) {
        // remove class active
        let block = this.block.querySelector(`div#id_${id}`)
        this.delClass(block, 'active')

        // esconde o objeto
        this.addClass(block.querySelector('svg.'+type), 'hide')
    }

    showEndGame(state) {
        let screen = this.block.querySelector('div#screenEndGame')
        screen.style.display = 'flex'
    
        if (state == 'Tied') return screen.innerHTML = `<div id="tied">Game Tied</div>`
        state = ts[state-1]
        screen.innerHTML = `<div id="${state}">Winner is ${state}</div>`
    }
}


const visualGame = new VisualGame()
new ListenInput(socket, game)


// Sockets
socket.on('updateGame', (state) => {
    game.game = state.game
    game.turn = state.turn
    game.history = state.history

    visualGame.loadGame()

    let currentRound = game.history[game.history.length-1]
    if (currentRound != undefined) {
        visualGame.showEndGame(currentRound.winner)
    }
    else document.querySelector('section#game div#screenEndGame').style.display = 'none'
})