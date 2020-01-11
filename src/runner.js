class Runner {

  constructor ({neat, games, gameSize, gameUnit, frameRate, maxTurns, lowestScoreAllowed, score, onEndGeneration}) {
    this.neat = neat
    this.games = []
    this.gamesFinished = 0
    this.onEndGeneration = onEndGeneration
    this.gameSize = gameSize
    this.gameUnit = gameUnit
    this.lowestScoreAllowed = lowestScoreAllowed
    this.maxTurns = maxTurns
    this.score = score
    this.frameRate = frameRate
    this.gameSize = gameSize
    this.gameUnit = gameUnit

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

    var highestEaten = 0;
    var minEaten = 10000000;
    var avgEaten = 0;


    for (let i = 0; i < this.games.length; i++) {
      avgEaten = avgEaten + this.games[i].snake.foodNumber;
      if(this.games[i].snake.foodNumber>highestEaten){
        highestEaten=this.games[i].snake.foodNumber;
      }
      if(this.games[i].snake.foodNumber < minEaten){
        minEaten=this.games[i].snake.foodNumber;
      }
    }

    avgEaten = avgEaten / this.games.length
    // push to chart
    this.onEndGeneration({
      generation: this.neat.generation,
      max: highestEaten,
      avg: avgEaten,
      min: minEaten,
      network: this.neat.getFittest(),
      highestEaten: highestEaten

    })

    const newGeneration = []

    var fittestBrain = this.games[0].snake.brain
    //console.log("snake:", fittestBrain)
    //var simulator = new Sim({fittestBrain, gameSize, gameUnit, frameRate, maxTurns, lowestScoreAllowed, score, onEndGeneration})
    // var sim = new Simulator({
    //     size: this.gameSize,
    //     unit: this.gameUnit,
    //     frameRate: this.frameRate,
    //     maxTurns: this.maxTurns,
    //     lowestScoreAllowed: this.lowestScoreAllowed,
    //     score: this.score,
    //     fittest: fittestSnake,
    //     onGameOver: () => this.endGeneration()
    //   })
    // push the most fit directly into the next gen
    var elites = []
    for (let i = 0; i < this.neat.elitism; i++) {
      elites.push(this.neat.population[i])
    }

    for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newGeneration.push(this.neat.getOffspring())
    }


    // might want to mutate first and then push the elite
    this.neat.population = newGeneration
    //this.neat.mutate()

    this.neat.population = newGeneration.concat(elites) 
    this.neat.mutate()
    this.neat.generation++
    this.startGeneration()
  }

}
