export class Messages {
    #observers
    constructor() {
        this.messages = {}

        this.template = (data) => {
            return {
                id: data.id,
                name: data.name,
                text: data.text
            }
        }
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

    add(room, data) {
        if (this.messages[room] == undefined) this.messages[room] = []
        this.messages[room].push(this.template(data))

        this.#notifyAll({
            type: 'add',
            room: room
        })
    }

    get getAll() { return this.messages }
    getRoom(room) { return this.messages[room] }
}