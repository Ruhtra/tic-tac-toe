const { MoveInvalid } = require('./msgErrors.js')
const {isNull, copyList} = require('./functions.js')

class Game {
    constructor () {
        this.simbols = [1, 2]
        this.template = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]
        this.game = copyList(this.template)
    } 
    // Functions
    #invertMatrix() {
        var temp = [... this.game]
    
        for (let i = 0; i < this.game.length; i++)  {
            for (let j = 0; j < this.game[i].length; j++)  {
                temp[i][j] = this.game[j][i]
            }
        }
        return temp;
    }
    #getDiagonals() {
        let d1 = []
        let d2 = []
        for (let i = 0; i < this.game.length; i++)  {
            d1.push(this.game[i][i])
        }
        for (let i = this.game.length-1; i >= 0; i--)  {
            d2.push(this.game[i][Math.abs(i-(this.game.length-1))])
        }
    
        return [d1, d2]
    }

    insert (p) {
        if ( (0 > p[0][0] || p[0][0] > 2) || (0 > p[0][1] || p[0][1] > 2) ) {
            throw new Error(MoveInvalid.outRange);
        }
        if (!isNull(this.game[p[0][0]][p[0][1]])) throw new Error(MoveInvalid.occupied)

        this.game[p[0][0]][p[0][1]] = p[1]
    }
    verify() {
        // Checking rows
        console.log('Checking rows')
        for (let x of this.game) {
            if (x.every(e => e == this.simbols[0]) || x.every(e => e == this.simbols[1])) return x[0]
        }
    
        // Checking columns
        console.log('Checking columns')
        for (let x of this.#invertMatrix()) {
            if (x.every(e => e == this.simbols[0]) || x.every(e => e == this.simbols[1])) return x[0]
        }
    
        // Checking diagonals
        console.log('Checking diagonals')
        let [d1, d2] = this.#getDiagonals()
        if (d1.every(e => e == this.simbols[0]) || d1.every(e => e == this.simbols[1])) return d1[0]
        if (d2.every(e => e == this.simbols[0]) || d2.every(e => e == this.simbols[1])) return d2[0]
    
        // Checking tied
        for (let i of this.game) {
            for (let j of i) {
                if (isNull(j)) return undefined
            }
        }
        return 'Tied'
    
    }
    reset() {
        this.game =  copyList(this.template)
    }

    get getTable() { return this.game }
    get getTemplate() { return this.template }
    get getSimbols() { return this.simbols }
}

exports.Game = Game
