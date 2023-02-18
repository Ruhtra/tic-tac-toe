import Game from "./public/game";
import { MoveInvalid } from "./public/msgErrors";

var game;
var simbols;
beforeEach(() => {
  game = new Game();
  simbols = game.getSimbols
}) 

describe("Functions", () => {
  describe("Input", () => {
    it("Should add simbol", () => {
      game.input(0)
  
      expect(game.getTable[0]).toBe(simbols[0])
    })
    it("Should out range", () => {
      var test = () => {game.input(9) }
  
      expect(test).toThrow(new Error(MoveInvalid.outRange));
    })
    it("Should move invalid", () => {
      game.input(0)
      var test = () => {game.input(0) }
  
      expect(test).toThrow(new Error(MoveInvalid.occupied));
    })
  })

  describe("Reset", () => {
    it("reset", () => {
      game.input(0)
      game.reset()
  
      expect(game.getTable).toEqual(game.getTemplate)
      expect(game.getTurn).toEqual(0)
      expect(game.lastGame).toEqual(undefined)
    })
  })
})

describe("Winners", () => {
	it("Should result is Tied", () => {
    game.input(0) // x
    game.input(1) // o
    game.input(2) // x
    game.input(3) // o
    game.input(4) // x
    game.input(6) // o
    game.input(5) // x
    game.input(8) // o
    game.input(7) // x

    expect(game.lastGame.winner).toBe('Tied')
	})

  describe("Win by row", () => {
    test("1", () => {
      game.input(0) // x
      game.input(4) // o
      game.input(1) // x
      game.input(5) // o
      game.input(2) // x
  
      expect(game.lastGame.winner).toBe(simbols[0])
    })
    test("2", () => {
      game.input(3) // x
      game.input(0) // o
      game.input(4) // x
      game.input(1) // o
      game.input(5) // x
  
      expect(game.lastGame.winner).toBe(simbols[0])
    })
    test("3", () => {
      game.input(6) // x
      game.input(0) // o
      game.input(7) // x
      game.input(1) // o
      game.input(8) // x
  
      expect(game.lastGame.winner).toBe(simbols[0])
    })
  })
  describe("Win by column", () => {
    test("1", () => {
      game.input(0) // x
      game.input(1) // o
      game.input(3) // x
      game.input(4) // o
      game.input(6) // x

      expect(game.lastGame.winner).toBe(simbols[0])
    })
    test("2", () => {
      game.input(1) // x
      game.input(0) // o
      game.input(4) // x
      game.input(3) // o
      game.input(7) // x

      expect(game.lastGame.winner).toBe(simbols[0])
    })
    test("3", () => {
      game.input(2) // x
      game.input(0) // o
      game.input(5) // x
      game.input(3) // o
      game.input(8) // x

      expect(game.lastGame.winner).toBe(simbols[0])
    })
  })
  describe("win by diagonal", () => {
    test("1", () => {
      game.input(0) // x
      game.input(1) // o
      game.input(4) // x
      game.input(2) // o
      game.input(8) // x

      expect(game.lastGame.winner).toBe(simbols[0])
    })
    test("2", () => {
      game.input(2) // x
      game.input(0) // o
      game.input(4) // x
      game.input(1) // o
      game.input(6) // x

      expect(game.lastGame.winner).toBe(simbols[0])
    })
  })
})