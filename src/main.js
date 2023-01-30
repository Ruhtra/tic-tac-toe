const { Game } = require("./game.js");

var game = new Game()
game.insert([[0,0], 1])

var r = game.verify()
if (r != undefined) {
    if ('tied') console.log('Velha!')
    else console.log(`${r} win!`)
}