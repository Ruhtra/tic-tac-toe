import { randomUUID } from 'crypto'

export default (socket, messages, name) => {
    socket.on('insertMessage', (data) => {
        data['id'] = randomUUID()
        data['name'] = name

        messages.add(data)
    })
}