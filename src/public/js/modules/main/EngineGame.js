import { VisualGame } from "./VisualGame.js"

const ts = ['x', 'circle']  // TEMPLATE SIMBOLS { TEMP }

export class EngineGame extends VisualGame {
    constructor(game) {
        super()
        this.game = game
    }

    loadGame(player) {
        // update in hovers
        this.addHover(ts[player.iPlayer])
        console.log(player.iPlayer)
        player.iPlayer == 0 ? this.removeHover(ts[1]) : this.removeHover(ts[0])

        // Update in game
        this.game.game.forEach((e, i) => {
            this.unVisible(i, ts[0])
            this.unVisible(i, ts[1])
            if (e != null) this.visible(i, ts[e-1])
        })

        // Verify winner
        let currentRound = this.game.lastGame
        if (currentRound != undefined) this.showEndGame(currentRound.winner)
        else this.clearScreenEndGame()

        // Change Turn
        if (this.game.getTurn %2 == player.iPlayer) {
            this.addHover(ts[player.iPlayer])
            this.modifyTurn(true)
        } else { 
            this.modifyTurn(false)
            this.removeHover(ts[player.iPlayer])
        }
    }
}
