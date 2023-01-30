const { Game } = require('./game.js')
const { MoveInvalid } = require('./msgErrors.js')

const simbols = new Game().simbols;

describe("Function insert", () => {
  let game;
  beforeEach(() => {
    game = new Game();
  })

	it("should add simbol", () => {
    game.insert([[0, 0], simbols[0]])

    expect(game.getTable[0][0]).toBe(simbols[0])
	})
  it("Should out range", () => {
    game.insert([[0, 0], simbols[0]])
    var test = () => {game.insert([[0, 4], simbols[1]]) }

    expect(test).toThrow(new Error(MoveInvalid.outRange));
  })
  it("Should move invalid", () => {
    game.insert([[0, 0], simbols[0]])
    var test = () => {game.insert([[0, 0], simbols[1]]) }

    expect(test).toThrow(new Error(MoveInvalid.occupied));
  })
})

describe("Function verify", () => {
  let game;
  beforeEach(() => {
    game = new Game();
  })

  test("win by row", () => {
    game.insert([[0, 0], simbols[0]])
    game.insert([[0, 1], simbols[0]])
    game.insert([[0, 2], simbols[0]])

    expect(game.verify()).toBe(simbols[0])
  })
  test("win by column", () => {
    game.insert([[0, 0], simbols[0]])
    game.insert([[1, 0], simbols[0]])
    game.insert([[2, 0], simbols[0]])

    expect(game.verify()).toBe(simbols[0])
  })
  test("win by diagonal", () => {
    game.insert([[0, 0], simbols[0]])
    game.insert([[1, 1], simbols[0]])
    game.insert([[2, 2], simbols[0]])

    expect(game.verify()).toBe(simbols[0])
  })
  test("win by diagonal reverse", () => {
    game.insert([[0, 2], simbols[0]])
    game.insert([[1, 1], simbols[0]])
    game.insert([[2, 0], simbols[0]])

    expect(game.verify()).toBe(simbols[0])
  })
	it("Should result is Tied", () => {
    game.insert([[0, 0], simbols[0]])
    game.insert([[0, 1], simbols[0]])
    game.insert([[0, 2], simbols[1]])
    game.insert([[1, 0], simbols[1]])
    game.insert([[1, 1], simbols[1]])
    game.insert([[1, 2], simbols[0]])
    game.insert([[2, 0], simbols[0]])
    game.insert([[2, 1], simbols[0]])
    game.insert([[2, 2], simbols[1]])

    expect(game.verify()).toBe('Tied')
	})
})

describe("Function reset", () => {
  let game;
  beforeEach(() => {
    game = new Game();
  })

  it("Should be equal", () => {
    game.insert([[0, 0], simbols[0]])
    game.reset()

    expect(game.getTable).toEqual(game.getTemplate)
  })
})