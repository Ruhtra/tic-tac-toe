export class ListenInput {
    constructor(socket, game) {
        this.inputs = document.querySelectorAll('main section#game > div.input')

        // Inputs for game
        this.inputs.forEach((element, index) => {
            element.addEventListener('click', () => {
                if (game.lastGame != undefined)
                    return console.log('Jogo finalizado')
                if (element.getAttribute('class').split(' ').indexOf('active') >= 0)
                    return console.log('não permitido')

                socket.emit('input', index)
            })
        })

        // Reset Game
        document.querySelector('div#round').addEventListener('click', () => {
            socket.emit('reset')
        })
    }
}