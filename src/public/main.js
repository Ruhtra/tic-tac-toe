player = Number('<%= player %>')
temp = {1: 'x', 2: 'circle'}
// gameTemp = [1, 2, 1, 1, null, 2, null, null, null]


class transmitGame {
    constructor() {
        this.socket = new io();
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
}

class visualGame extends transmitGame {
    constructor() {
        super()
        this.game = document.querySelector('section#game') 

        // Adicionar função click as divs
        game.querySelectorAll('div').forEach((element, i) => {
            element.addEventListener('click', () => {
                if (element.getAttribute('class') == 'active') return console.log('não permitido')
                
                this.insert(i)
                    .then(async () => {
                        this.loadGame(await this.getGame())
                    })
            })
        })

        // Adicionar o hover no simbolo do player
        document.querySelectorAll('svg.'+temp[player]).forEach(e => {
            e.setAttribute('class', temp[player]+' hide hover')
        })
    }

    insertElement(player, position) {
        let element = this.game.querySelector(`div#id_${position}`)
        element.setAttribute('class', 'active')
        element.querySelector('.'+temp[player]).style.display = 'block'
    }

    loadGame(game) {
        game.forEach((e, i) => {
            if (e != null) this.insertElement(e, i)
        })
    }
}

const connection = new visualGame()

// connection.loadGame(gameTemp)