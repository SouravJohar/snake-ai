class Runner {

  constructor ({neat, games, gameSize, gameUnit, frameRate, maxTurns, lowestScoreAllowed, score, onEndGeneration}) {
    this.neat = neat
    this.games = []
    this.gamesFinished = 0
    this.onEndGeneration = onEndGeneration

    for (let i = 0; i < games; i++) {
      this.games.push(new Game({
        size: gameSize,
        unit: gameUnit,
        frameRate,
        maxTurns,
        lowestScoreAllowed,
        score,
        onGameOver: () => this.endGeneration()
      }))
    }
  }

  startGeneration () {
    this.gamesFinished = 0

    for (let i = 0; i < this.games.length; i++) {
      this.games[i].snake.brain = this.neat.population[i]
      this.games[i].snake.brain.score = 0
      this.games[i].start()
    }
  }

  endGeneration () {
    if (this.gamesFinished + 1 < this.games.length) {
      this.gamesFinished++
      return
    }

    this.neat.sort()

    // push to chart
    this.onEndGeneration({
      generation: this.neat.generation,
      max: this.neat.getFittest().score,
      avg: Math.round(this.neat.getAverage()),
      min: this.neat.population[this.neat.popsize - 1].score
    })

    const newGeneration = []

    // push the most fit directly into the next gen
    for (let i = 0; i < this.neat.elitism; i++) {
      newGeneration.push(this.neat.population[i])
    }

    for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newGeneration.push(this.neat.getOffspring())
    }


    // might want to mutate first and then push the elite directly
    this.neat.population = newGeneration
    this.neat.mutate()
    this.neat.generation++
    this.startGeneration()
  }

}
