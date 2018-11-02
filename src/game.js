class Game {

  constructor ({size, unit, frameRate, maxTurns, lowestScoreAllowed, score, onGameOver}) {
    this.size = size
    this.unit = unit
    this.unitsPerRow = this.size / this.unit
    this.frameRate = frameRate
    this.maxTurns = maxTurns
    this.lowestScoreAllowed = lowestScoreAllowed
    this.onGameOver = onGameOver
    this.status = 'IDLE'
    this.grid = []
    this.snake = new Snake(score)
    this.turns = 0

    for (let x = 0; x < this.unitsPerRow; x++) {
      for (let y = 0; y < this.unitsPerRow; y++) {
        this.grid.push([x + 1, y + 1])
      }
    }
    
    const game = this

    var sketch = function(p) {

      p.setup = function() {
        p.frameRate(game.frameRate)
        p.createCanvas(game.size, game.size)
      }

      p.drawFood = function(){
        p.fill('red')
        p.rect(
          game.food.position[0] * game.unit - game.unit,
          game.food.position[1] * game.unit - game.unit,
          game.unit,
          game.unit
        )
      }

      p.drawSnake = function(){
        p.fill('black')
        var flag = 1
        for (var segment of game.snake.segments) {
          if (flag == game.snake.segments.length)
            p.fill('yellow')
          p.rect(segment[0] * game.unit - game.unit,
            segment[1] * game.unit - game.unit,
            game.unit,
            game.unit)
          flag++;
        }
        p.fill('black')
        // p.text("canMoveForward: " + game.snake.observations[0], 5, 20)
        // p.text("canMoveLeft: " + game.snake.observations[1], 5, 40)
        // p.text("canMoveRight: " + game.snake.observations[2], 5, 60)
      }

      p.draw = function() {
        if (['IDLE', 'GAME_OVER'].indexOf(game.status) !== -1) {
          p.background('#EEE')
          p.fill(0)
          p.textSize(15)
          p.text("Score: " + game.snake.brain.score.toString(), 5, 20)
          return
        }
          if (document.getElementById('train_fps').checked) {
          p.frameRate(game.frameRate)
        }
        else {
          p.frameRate(5)
        }

        p.background(255)

        game.snake.move(game)

        if (game.snake.isEating) {
          game.food = new Food(game)
        }

        game.updateGameStatus()

        if (game.status === 'GAME_OVER') {
          return game.onGameOver()
        }

        p.drawSnake()
        p.drawFood()

        game.turns++
      }
    }

    var render = new p5(sketch, 'wrapper')
  }

  updateGameStatus () {
    const snakeHeadIndex = this.snake.segments.length - 1
    const snakeHead = this.snake.segments[snakeHeadIndex]
    const snakeHitWall = snakeHead[0] < 1 || snakeHead[0] > this.unitsPerRow || snakeHead[1] < 1 || snakeHead[1] > this.unitsPerRow
    const snakeHitTail = this.snake.segments.some((s, i) => s[0] === snakeHead[0] && s[1] === snakeHead[1] && i !== snakeHeadIndex)
    const noMoreRoomLeft = this.getAvailablePositions().length === 1
    const gameLastedLongEnough = this.turns > this.maxTurns
    const scoreTooLow = this.snake.brain.score <= this.lowestScoreAllowed
    const loop = this.snake.hungrySteps > 400
    
    if (snakeHitWall || snakeHitTail || noMoreRoomLeft || scoreTooLow || loop) {
      this.status = 'GAME_OVER'
    }

    // update fitness if snake died
    if(snakeHitTail || snakeHitWall) {
      this.snake.oldScore = this.snake.brain.score
      this.snake.brain.score += this.snake.scoreModifiers.death;
    }
  }

  getAvailablePositions () {
    return this.grid.filter(position => {
      return !this.snake.segments.some(segment => {
        return position[0] === segment[0] && position[1] === segment[1]
      })
    })
  }

  start () {
    this.turns = 0
    this.snake.reset()
    this.food = new Food(this)
    this.status = 'RUNNING'
  }

}
