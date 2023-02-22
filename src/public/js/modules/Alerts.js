class Messages {
    constructor(block) {
        this.block = block
        this.list = {}
    }
    template(message) {
        const id = (Math.random()*10**19).toString()
    
        var newDiv = document.createElement('div')
        newDiv.id = `_${id}`
        newDiv.innerHTML = message;
    
        return [newDiv, id]
    }
    insert(msg) {
        var [div, id] = this.template(msg)

        this.block.appendChild(div)

        this.list[id] = {
            message: msg,
            time: setTimeout(() => {this.close(id)}, 6000)
        }
        setTimeout(() => { this.show(id) }, 0)
    }
    show(id) {
        this.block.querySelector(`div#_${id}`).style.transform = 'translateX(calc(100% + 2vw)'
    }
    close(id) {
        id = id.split('_')[1] || id
        clearTimeout(this.list[id].time)

        const item = this.block.querySelector(`div#_${id}`)

        item.style.transform = 'translateX(0)'

        // setTimeout(() => { item.style.maxHeight = 0 }, 1000);
        setTimeout(() => { item.remove() }, 2000) 
    }
}

export default Messages 