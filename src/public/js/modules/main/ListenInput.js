export class ListenInput {
    constructor(socket, game) {
        this.inputs = document.querySelectorAll('main section#game > div.input')
        this.chat = {
            chat: document.querySelector('#chat'),
            input: document.querySelector('#chat #input input')
        }

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
        document.querySelector('div#reset').addEventListener('click', () => {
            socket.emit('reset')
        })

        // Send Message
        this.chat.chat.querySelector('#btnSend').addEventListener('click', () => {
            let msg = this.chat.input.value
            if (msg.length == 0) return console.log('Empty input')
            socket.emit('insertMessage', {
                text: msg
            })
            this.chat.input.value = ''
        })
        this.chat.input.addEventListener('keyup', (e) => {
            var key = e.which || e.keyCode;
            if (key == 13) {
                let msg = this.chat.input.value
                if (msg.length == 0) return console.log('Empty input')
                socket.emit('insertMessage', {
                    text: msg
                })
                this.chat.input.value = ''
            }
          });
    }
}