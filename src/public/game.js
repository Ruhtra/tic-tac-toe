import { MoveInvalid, EndGame } from './msgErrors.js'
import { isNull, copyList } from './functions.js'

class Game {
    #simbols
    #template
    #observers

    constructor () {
        this.gameActive = true
        this.#simbols = [1, 2]
        this.#template = [
            null, null, null,
            null, null, null,
            null, null, null
        ]
        this.game = copyList(this.#template)
        this.round = 0

        this.#observers = []
    } 

    // Observer functions
    subscribe (observerFunction) {
        this.#observers.push(observerFunction)
    }
    #notifyAll (command) {
        for (const observerFunction of this.#observers) {
            observerFunction(command)
        }
    }

    // Functions game
    #transformInMatrix(lista) {
        let transform = [[], [], []]

        lista.forEach((e, i) => {
            if (i < 3) {
                transform[0].push(e)
            } else if (i < 6) {
                transform[1].push(e)
            } else {
                transform[2].push(e)
            }
        })

        return transform
    }
    #invertMatrix() {
        let temp = this.#transformInMatrix([... this.game])
    
        for (let i = 0; i < temp.length; i++)  {
            for (let j = 0; j < temp[i].length; j++)  {
                temp[i][j] = temp[j][i]
            }
        }
        return temp;
    }
    #getDiagonals() {
        let temp = this.#transformInMatrix([... this.game])
        let d1 = []
        let d2 = []
        for (let i = 0; i < temp.length; i++)  {
            d1.push(temp[i][i])
        }
        for (let i = temp.length-1; i >= 0; i--)  {
            d2.push(temp[i][Math.abs(i-(temp.length-1))])
        }
    
        return [d1, d2]
    }

    // getters

    input (pos) {
        if (!this.gameActive) throw new Error(EndGame) 
        if ((0 > pos || pos > 8)) throw new Error(MoveInvalid.outRange)
        if (!isNull(this.game[pos])) throw new Error(MoveInvalid.occupied)

        let player = this.getPlayer()

        this.game[pos] = player
        this.round += 1



        this.verify()
        this.#notifyAll({
            type: 'input',
            pos: pos,
            player: player
        })
    }
    verify() {
        let checking = () => {
            // Checking rows
            for (let x of this.#transformInMatrix(this.game)) {
                if (x.every(e => e == this.#simbols[0]) || x.every(e => e == this.#simbols[1])) return x[0]
            }

            // Checking columns
            for (let x of this.#invertMatrix()) {
                if (x.every(e => e == this.#simbols[0]) || x.every(e => e == this.#simbols[1])) return x[0]
            }

            // Checking diagonals
            let [d1, d2] = this.#getDiagonals()
            if (d1.every(e => e == this.#simbols[0]) || d1.every(e => e == this.#simbols[1])) return d1[0]
            if (d2.every(e => e == this.#simbols[0]) || d2.every(e => e == this.#simbols[1])) return d2[0]

            if (this.round == 9) return 'Tied'
        }

        let stateWinner = checking()
        if (stateWinner) {
            this.gameActive = false
            this.#notifyAll({
                type: 'endGame',
                state: stateWinner 
            })
        }

        
    }
    reset() {
        this.gameActive = true
        this.game =  copyList(this.#template)
        this.round = 0

        this.#notifyAll({
            type: 'resetGame'
        })
    }

    getPlayer() {
        let player
        this.round %2 == 0 ? player = this.#simbols[0] : player = this.#simbols[1]
        return player
    }

    get getTable() { return this.game }
    get getTemplate() { return this.#template }
    get getSimbols() { return this.#simbols }
    get getRound() { return this.round }
}

export default Game