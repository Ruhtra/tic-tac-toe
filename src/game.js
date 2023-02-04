const { MoveInvalid } = require('./msgErrors.js')
const {isNull, copyList} = require('./functions.js')

class Game {
    #simbols
    #template
    constructor () {
        this.#simbols = [1, 2]
        this.#template = [
            null, null, null,
            null, null, null,
            null, null, null
        ]
        this.game = copyList(this.#template)
        this.round = 0
    } 
    // Functions
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

    insert (p) {
        if ( (0 > p.pos || p.pos > 8) ) {
            throw new Error(MoveInvalid.outRange);
        }
        if (!isNull(this.game[p.pos])) throw new Error(MoveInvalid.occupied)

        this.game[p.pos] = p.player
        this.round += 1
    }
    verify() {
        // Checking rows
        console.log('Checking rows')
        for (let x of this.#transformInMatrix(this.game)) {
            if (x.every(e => e == this.#simbols[0]) || x.every(e => e == this.#simbols[1])) return x[0]
        }
    
        // Checking columns
        console.log('Checking columns')
        for (let x of this.#invertMatrix()) {
            if (x.every(e => e == this.#simbols[0]) || x.every(e => e == this.#simbols[1])) return x[0]
        }
    
        // Checking diagonals
        console.log('Checking diagonals')
        let [d1, d2] = this.#getDiagonals()
        if (d1.every(e => e == this.#simbols[0]) || d1.every(e => e == this.#simbols[1])) return d1[0]
        if (d2.every(e => e == this.#simbols[0]) || d2.every(e => e == this.#simbols[1])) return d2[0]
    
        // Checking tied
        for (let i of this.#transformInMatrix(this.game)) {
            for (let j of i) {
                if (isNull(j)) return undefined
            }
        }
        return 'Tied'
    }
    reset() {
        this.game =  copyList(this.#template)
        this.round = 0
    }

    get getTable() { return this.game }
    get getTemplate() { return this.#template }
    get getSimbols() { return this.#simbols }
    get getRound() { return this.round }
}

exports.Game = Game