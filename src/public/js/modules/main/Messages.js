export class Messages {
    constructor(block, myName) {
        this.block = block
        this.myName = myName
    
        this.template = (data) =>  `
        <div class="message${data.me == true ? ' me' : ''}" id="id_${data.id}">
            <span class="name">${data.name}</span>
            <div class="text">${data.text}</div>
        </div>`
    
    }

    add(data) {
        if (data.name == this.myName) data.me = true
        this.block.innerHTML = this.template(data) + this.block.innerHTML
        // this.block.insertBefore(/*first element*/, this.block.querySelector('div:first-child'))
    }

    loadMessages(listMessages) {
        this.block.innerHTML = ''
        
        if (!listMessages) return
        listMessages.forEach(e => {
            this.add(e)
        });
    }
}