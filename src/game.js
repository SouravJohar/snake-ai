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
    this.timeAlive = 0

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
        //var Slider = p.createSlider(0, 255, 100);
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
        // for (let x = 0; x < this.unitsPerRow; x++) {
        //   for (let y = 0; y < this.unitsPerRow; y++) {
        //     p.text()
        //   }
        // }
        //p.text(this.snake.conflict.toString(), 5,20)
        // game.snake.segments.forEach(s => {
        //   p.rect(
        //     s[0] * game.unit - game.unit,
        //     s[1] * game.unit - game.unit,
        //     game.unit,
        //     game.unit
        //   )
        // })
        p.text("score: " + game.snake.foodNumber, 5, 20)
        var flag = 1
        p.fill('pink')
        //console.log(game.snake.obstacles)
        for (var obstacle of game.snake.obstacles) {
          for (var pt of obstacle) {
          p.rect(pt[0] * game.unit - game.unit,
            pt[1] * game.unit - game.unit,
            game.unit,
            game.unit)
        }
        }
        p.fill('black')
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
        
        // p.text("canMoveLeft: " + game.snake.observations[1], 5, 40)
        // p.text("canMoveRight: " + game.snake.observations[2], 5, 60)
      }

      p.draw = function() {
        if (['IDLE', 'GAME_OVER'].indexOf(game.status) !== -1) {
          p.background('#EEE')
          p.fill(0)
          p.textSize(15)
          //p.text("updated" + game.snake.brain.score.toString(), 5, 20)
          //p.text("old" + game.snake.oldScore.toString(), 5, 50)
          
          return
        }
          if (document.getElementById('train_fps').checked) {
          p.frameRate(60)
        }
        else {
          p.frameRate(3)
        }

        p.background(255)

        game.snake.move(game)

        if (game.snake.isEating) {
          // game.food = new Food(game)
          var flag = true;
          while (flag) {
            game.food = new Food(game)
            break
            for (var t of game.snake.obstacles) {
              for (var pt of t) {
                console.log(game.food)
                console.log(pt)
                if (game.food[0] != pt[0] && game.food[1] != pt[1]) { 
                  flag = false;
                  break}   
              }
              if (!flag) {
                break
              }
            }
          }
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
    const killed_obstacle = this.snake.flat.some((s, i) => s[0] === snakeHead[0] && s[1] === snakeHead[1])
    const snakeHitWall = snakeHead[0] < 1 || snakeHead[0] > this.unitsPerRow || snakeHead[1] < 1 || snakeHead[1] > this.unitsPerRow
    const snakeHitTail = this.snake.segments.some((s, i) => s[0] === snakeHead[0] && s[1] === snakeHead[1] && i !== snakeHeadIndex)
    const noMoreRoomLeft = this.getAvailablePositions().length === 1
    const gameLastedLongEnough = this.turns > this.maxTurns
    const scoreTooLow = this.snake.brain.score <= this.lowestScoreAllowed
    const loop = this.snake.hungrySteps > 400
    if (loop && this.snake.segments.lenght <= 7 ) {
      this.snake.score = 0
    }

    if (snakeHitWall || snakeHitTail || noMoreRoomLeft || scoreTooLow || loop || killed_obstacle) {
      this.status = 'GAME_OVER'
    }

    // update fitness if snake died
    if(snakeHitTail || snakeHitWall) {
      this.snake.oldScore = this.snake.brain.score
      this.snake.brain.score += this.snake.scoreModifiers.death;
    }
  }

  getAvailablePositions () {
    // var everything = this.snake.segments
    // for (var obstacle of this.snake.obstacles) {
    //   for (var pt of obstacle) {
    //     everything.push(pt)
    //   }
    // }
    //console.log(everything)
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
