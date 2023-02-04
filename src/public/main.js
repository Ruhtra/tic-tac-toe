temp = {1: 'x', 2: 'circle'}

function isMyTurn(round, player) {
    if (round %2 == 0) {
        if (player == 1) return true
        else return false
    }

    if (player == 2) return true
    else return false
}


class transmitGame {
    constructor() {
        this.socket = new io();

        this.socket.on('updateGame', (game) => {
            this.loadGame(game)
        })
    }

    insert(pos) {
        return new Promise((resolve, reject) => {
            this.socket.emit('insert', pos, (res) => {
                if (res == 'ok') resolve()
            })
        })
    }
    getGame() {
        return new Promise((resolve, reject) => {
            this.socket.emit('getTable', (res) => {
                resolve(res)
            })
        })
    }
    getPlayer() {
        return new Promise((resolve, reject) => {
            this.socket.emit('getPlayer', (res) => {
                resolve(res)
            })
        })
    }
    getRound() {
        return new Promise((resolve, reject) => {
            this.socket.emit('getRound', (res) => {
                resolve(res)
            })
        })
    }
}

class visualGame extends transmitGame {
    constructor() {
        return (async () => {
            super()
            this.player = await this.getPlayer()
            this.game = document.querySelector('section#game') 
    
            // Adicionar função click as divs
            game.querySelectorAll('div').forEach((e, i) => {
                e.addEventListener('click', async  () => {
                    // Refatorar esse code {
                if (e.getAttribute('class') == 'active') return console.log('não permitido')
                if (!isMyTurn(await this.getRound(), this.player)) return console.log('não é seu round')

                this.insert(i)
                // }
                })
            })

            this.loadGame(await this.getGame())

            return this;
          })();
    }
    addHover() {
        document.querySelectorAll('svg.'+temp[this.player]).forEach(e => {
            let string = e.getAttribute('class') + ' hover'
            e.setAttribute('class', string)
        })
    }
    removeHover() {
        document.querySelectorAll('svg.'+temp[this.player]).forEach(e => {
            let string = e.getAttribute('class').split(' ')
            let newClass = string.filter((e) => e != 'hover').join(' ')

            e.setAttribute('class', newClass)
        })
    }

    insertElement(player, position) {
        let element = this.game.querySelector(`div#id_${position}`)
        element.setAttribute('class', 'active')
        element.querySelector('.'+temp[player]).style.display = 'block'
    }
    loadGame(game) {
        // Atualiza o round
        this.getRound()
            .then((round) => {
                if (isMyTurn(round, this.player)) {
                    document.querySelector('div#round').style.background = 'green'
                    this.addHover()
                } else {
                    document.querySelector('div#round').style.background = 'red'
                    this.removeHover()
                }
            })

        // carrega o game
        game.forEach((e, i) => {
            if (e != null) this.insertElement(e, i)
        })
    }
}

const connection = new visualGame()