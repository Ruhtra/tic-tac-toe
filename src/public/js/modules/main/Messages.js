export class Messages {
    constructor(socket, block) {
        this.block = block
        this.socket = socket
    
        this.template = (data) =>  `
        <div class="message${data.me == true ? ' me' : ''}" id="id_${data.id}">
            <span class="name">${data.name}</span>
            <div class="text">${data.text}</div>
        </div>`
    
    }

    add(data) {
        this.socket.emit('insertMessage', data)
        this.block.innerHTML = this.template(data) + this.block.innerHTML
        // this.block.insertBefore(/*first element*/, this.block.querySelector('div:first-child'))
    }
}