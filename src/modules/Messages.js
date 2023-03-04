export default class Messages {
    #observers
    constructor() {
        this.messages = []

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

    add(data) {
        this.messages.push(this.template(data))

        this.#notifyAll({
            type: 'add'
        })
    }

    get getAll() { return this.messages }
}