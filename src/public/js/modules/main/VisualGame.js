const ts = ['x', 'circle']  // TEMPLATE SIMBOLS { TEMP }

export class VisualGame {
    constructor () {
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
        // Insert in screen winner
        let screen = this.block.querySelector('div#screenEndGame')
        screen.style.display = 'flex'
    
        // Show message Winnner
        if (state == 'Tied') screen.innerHTML = `<div id="tied">Game Tied</div>`
        else {
            state = ts[state-1]
            screen.innerHTML = `<div id="${state}">Winner is ${state}</div>`
        }

        // Clear hovers
        this.block.querySelectorAll('div.input').forEach((e, i) => {
            this.removeHover(ts[0])
            this.removeHover(ts[1])
        })
    }
    clearScreenEndGame() {
        document.querySelector('section#game div#screenEndGame').style.display = 'none'
    }
    
    modifyTurn(myTurn){
        let blockTurn = document.querySelector('main header div#round')

        if (myTurn) blockTurn.style.background = 'green'
        else blockTurn.style.background = 'red'
    }
}