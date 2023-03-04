import { randomUUID } from 'crypto'

export default (socket, getRoom) => {
    let messages = getRoom.messages

    socket.on('insertMessage', (data) => {
        data['id'] = randomUUID()
        data['name'] = getRoom.getPlayer(socket.id).name

        messages.add(data)
    })
}