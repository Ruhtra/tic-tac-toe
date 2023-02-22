import { VisualGame } from "./VisualGame.js"

const ts = ['x', 'circle']  // TEMPLATE SIMBOLS { TEMP }

export class EngineGame extends VisualGame {
    constructor(game) {
        super()
        this.game = game
    }

    loadGame() {
        // update in hovers
        if (this.game.turn %2 == 0) {
            this.addHover(ts[0])
            this.removeHover(ts[1])
        } else {
            this.addHover(ts[1])
            this.removeHover(ts[0])
        }

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
    }
}
