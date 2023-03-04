export default (socket, game, iPlayer) => {
    socket.on('input', (id) => {
        if (game.getTurn %2 != iPlayer) return console.log('Input não é permitido por esse player')
        game.input(id)
    })
    socket.on('reset', () => { game.reset() })
}