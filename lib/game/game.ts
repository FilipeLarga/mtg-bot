class Game {
  private readonly maxGuesses: number;

  private guesses: number;

  constructor(maxGuesses: number) {
    this.maxGuesses = maxGuesses;

    this.guesses = 0;
  }
}

export default Game;
