const { Game } = require('./game.js')
const { MoveInvalid } = require('./msgErrors.js')

const simbols = new Game().simbols;

describe("Function insert", () => {
  let game;
  beforeEach(() => {
    game = new Game();
  }) 

	it("should add simbol", () => {
    game.insert({
      pos: 0, 
      player: simbols[0]
    })

    expect(game.getTable[0]).toBe(simbols[0])
	})
  it("Should out range", () => {
    var test = () => {game.insert({
      pos: 9,
      player: simbols[0]
    }) }

    expect(test).toThrow(new Error(MoveInvalid.outRange));
  })
  it("Should move invalid", () => {
    game.insert({
      pos: 0,
      player: simbols[0]
    })
    var test = () => {game.insert({
      pos: 0, 
      player: simbols[1]
    }) }

    expect(test).toThrow(new Error(MoveInvalid.occupied));
  })
})

describe("Function verify", () => {
  let game;
  beforeEach(() => {
    game = new Game();
  })

  test("win by row", () => {
    game.insert({
      pos: 0, 
      player: simbols[0]
    })
    game.insert({
      pos: 1, 
      player: simbols[0]
    })
    game.insert({
      pos: 2, 
      player: simbols[0]
    })

    expect(game.verify()).toBe(simbols[0])
  })
  test("win by column", () => {
    game.insert({
      pos: 0, 
      player: simbols[0]
    })
    game.insert({
      pos: 3, 
      player: simbols[0]
    })
    game.insert({
      pos: 6, 
      player: simbols[0]
    })

    expect(game.verify()).toBe(simbols[0])
  })
  test("win by diagonal", () => {
    game.insert({
      pos: 0, 
      player: simbols[0]
    })
    game.insert({
      pos: 4, 
      player: simbols[0]
    })
    game.insert({
      pos: 8, 
      player: simbols[0]
    })

    expect(game.verify()).toBe(simbols[0])
  })
  test("win by diagonal reverse", () => {
    game.insert({
      pos: 2, 
      player: simbols[0]
    })
    game.insert({
      pos: 4, 
      player: simbols[0]
    })
    game.insert({
      pos: 6, 
      player: simbols[0]
    })

    expect(game.verify()).toBe(simbols[0])
  })
	it("Should result is Tied", () => {
    game.insert({pos: 0, player: simbols[0]})
    game.insert({pos: 1, player: simbols[0]})
    game.insert({pos: 2, player: simbols[1]})
    game.insert({pos: 3, player: simbols[1]})
    game.insert({pos: 4, player: simbols[1]})
    game.insert({pos: 5, player: simbols[0]})
    game.insert({pos: 6, player: simbols[0]})
    game.insert({pos: 7, player: simbols[0]})
    game.insert({pos: 8, player: simbols[1]})

    expect(game.verify()).toBe('Tied')
	})
})

describe("Function reset", () => {
  let game;
  beforeEach(() => {
    game = new Game();
  })

  it("Should be equal", () => {
    game.insert({
      pos: 0, 
      player: simbols[0]
    })
    game.reset()

    expect(game.getTable).toEqual(game.getTemplate)
  })
})