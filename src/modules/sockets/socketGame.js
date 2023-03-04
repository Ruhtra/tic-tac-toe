export default (socket, getRoom) => {
    let game = getRoom.game
    
    socket.on('input', (id) => {
        if (game.getTurn %2 != getRoom.getIdPlayer(socket.id)) return console.log('Input não é permitido por esse player')
        game.input(id)
    })
    socket.on('reset', () => { game.reset() })
}