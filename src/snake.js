class Snake {

  constructor (score) {
    this.scoreModifiers = score
    this.oldScore = 0
    this.foodNumber = 0
    this.cautionRange = 2;
    this.observations = [];
    this.hungrySteps = 0;
    this.flat = []
    this.obstacles = []
    this.obstacleLifeTime = 0
    this.history = [0,0]

    // turn on the obstacles
    this.difficult = true;
  }

  reset () {

    // may want to reduce this
    this.segments = [
    [1,1],
    [1,2],
    [1,3],
    [1,4],
    [1,5]
    ]
    this.direction = 'right'
    this.isEating = false
    this.oldScore = 0
    this.foodNumber = 0
    this.cautionRange = 2;
    this.observations = [];
    this.hungrySteps = 0;
    this.obstacles = []
    this.flat = []
    this.obstacleLifeTime = 0
    this.history = [0,0]
  }

  move (game) {
    let canMoveForward = 0
    let canMoveLeft = 0
    let canMoveRight = 0
    let isFoodForward = 0
    let isFoodLeft = 0
    let isFoodRight = 0

    let head = this.segments[this.segments.length - 1]

    this.brain.score += this.scoreModifiers.timeAlive

if (this.difficult) {
    if (Math.random() < 0.11 && this.obstacles.length < 5) {
      var coords = game.getAvailablePositions()
      //console.log(coords)
      coords = coords[Math.floor(Math.random() * coords.length)]
      var coords1 = [coords[0] + 1, coords[1]]
      var coords2 = [coords[0] + 1, coords[1] + 1]
      var coords3 = [coords[0], coords[1] + 1]
      this.obstacles.push([coords, coords1, coords2, coords3])
      this.flat.push(coords, coords1, coords2, coords3)
      //console.log(this.obstacles)
      //console.log("pushed obstacle")
      this.obstacleLifeTime = 1
    }

    if (this.obstacleLifeTime >= 1) {
      this.obstacleLifeTime++;
    }
    //console.log(this.obstacleLifeTime)
    if (this.obstacleLifeTime >= 100) {
      this.obstacles = []
      this.flat = []
      this.obstacleLifeTime = 0;
    }
  }  
    
    //console.table(head)
    //console.table(this.segments)


    // assess the environment to get the input for the neural network
    // console.table(head)
    // console.table(this.segments)

    switch (this.direction) {
      case 'up':
        
        if (head[1] !== 1) canMoveForward = 1
        if (head[0] !== 1) canMoveLeft = 1
        if (head[0] !== game.unitsPerRow) canMoveRight = 1
        if (game.food.position[1] < head[1]) isFoodForward = 1
        if (game.food.position[0] < head[0]) isFoodLeft = 1
        if (game.food.position[0] > head[0]) isFoodRight = 1
        this.segments.forEach(s => {
          // if (head[0] === s[0] && head[1] - 2 === s[1]) {canMoveForward = 0;}
          // if (head[0] - 2 === s[0] && head[1] === s[1]) {canMoveLeft = 0;}
          // if (head[0] + 2 === s[0] && head[1] === s[1]) {canMoveRight = 0;}
          if (head[0] === s[0] && head[1] - 1 === s[1]) {canMoveForward = -1;}
          if (head[0] - 1 === s[0] && head[1] === s[1]) {canMoveLeft = 0;}
          if (head[0] + 1 === s[0] && head[1] === s[1]) {canMoveRight = 0;}
        })
      this.flat.forEach(o => {
          // if (head[0] === s[0] && head[1] - 2 === s[1]) {canMoveForward = 0;}
          // if (head[0] - 2 === s[0] && head[1] === s[1]) {canMoveLeft = 0;}
          // if (head[0] + 2 === s[0] && head[1] === s[1]) {canMoveRight = 0;}
          if (head[0] === o[0] && head[1] - 1 === o[1]) {canMoveForward = -1;}
          if (head[0] - 1 === o[0] && head[1] === o[1]) {canMoveLeft = 0;}
          if (head[0] + 1 === o[0] && head[1] === o[1]) {canMoveRight = 0;}
        })
        break
      case 'down':
        if (head[1] !== game.unitsPerRow) canMoveForward = 1
        if (head[0] !== game.unitsPerRow) canMoveLeft = 1
        if (head[0] !== 1) canMoveRight = 1
        if (game.food.position[1] > head[1]) isFoodForward = 1
        if (game.food.position[0] < head[0]) isFoodRight = 1
        if (game.food.position[0] > head[0]) isFoodLeft = 1
        this.segments.forEach(s => {
          // if (head[0] === s[0] && head[1] + 2 === s[1]) {canMoveForward = 0; }
          // if (head[0] + 2 === s[0] && head[1] === s[1]) {canMoveLeft = 0;}
          // if (head[0] - 2 === s[0] && head[1] === s[1]) {canMoveRight = 0; }
          if (head[0] === s[0] && head[1] + 1 === s[1]) {canMoveForward = -1; }
          if (head[0] + 1 === s[0] && head[1] === s[1]) {canMoveLeft = 0;}
          if (head[0] - 1 === s[0] && head[1] === s[1]) {canMoveRight = 0; }
        })
      this.flat.forEach(s => {
          // if (head[0] === s[0] && head[1] + 2 === s[1]) {canMoveForward = 0; }
          // if (head[0] + 2 === s[0] && head[1] === s[1]) {canMoveLeft = 0;}
          // if (head[0] - 2 === s[0] && head[1] === s[1]) {canMoveRight = 0; }
          if (head[0] === s[0] && head[1] + 1 === s[1]) {canMoveForward = -1; }
          if (head[0] + 1 === s[0] && head[1] === s[1]) {canMoveLeft = 0;}
          if (head[0] - 1 === s[0] && head[1] === s[1]) {canMoveRight = 0; }
        })
        break
      case 'left':
        if (head[0] !== 1) canMoveForward = 1
        if (head[1] !== game.unitsPerRow) canMoveLeft = 1
        if (head[1] !== 1) canMoveRight = 1
        if (game.food.position[0] < head[0]) isFoodForward = 1
        if (game.food.position[1] < head[1]) isFoodRight = 1
        if (game.food.position[1] > head[1]) isFoodLeft = 1
        this.segments.forEach(s => {
          // if (head[1] === s[1] && head[0] - 2 === s[0]) {canMoveForward = 0;}
          // if (head[1] + 2 === s[1] && head[0] === s[0]) {canMoveLeft = 0;}
          // if (head[1] - 2 === s[1] && head[0] === s[0]) {canMoveRight = 0;}
          if (head[1] === s[1] && head[0] - 1 === s[0]) {canMoveForward = -1;}
          if (head[1] + 1 === s[1] && head[0] === s[0]) {canMoveLeft = 0;}
          if (head[1] - 1 === s[1] && head[0] === s[0]) {canMoveRight = 0;}
        })
      this.flat.forEach(s => {
          // if (head[1] === s[1] && head[0] - 2 === s[0]) {canMoveForward = 0;}
          // if (head[1] + 2 === s[1] && head[0] === s[0]) {canMoveLeft = 0;}
          // if (head[1] - 2 === s[1] && head[0] === s[0]) {canMoveRight = 0;}
          if (head[1] === s[1] && head[0] - 1 === s[0]) {canMoveForward = -1;}
          if (head[1] + 1 === s[1] && head[0] === s[0]) {canMoveLeft = 0;}
          if (head[1] - 1 === s[1] && head[0] === s[0]) {canMoveRight = 0;}
        })
        break
      case 'right':
        if (head[0] !== game.unitsPerRow) canMoveForward = 1
        if (head[1] !== 1) canMoveLeft = 1
        if (head[1] !== game.unitsPerRow) canMoveRight = 1
        if (game.food.position[0] > head[0]) isFoodForward = 1
        if (game.food.position[1] < head[1]) isFoodLeft = 1
        if (game.food.position[1] > head[1]) isFoodRight = 1
        this.segments.forEach(s => {
          // if (head[1] === s[1] && head[0] + 2 === s[0]) {canMoveForward = 0;}
          // if (head[1] - 2 === s[1] && head[0] === s[0]) {canMoveLeft = 0;}
          // if (head[1] + 2 === s[1] && head[0] === s[0]) {canMoveRight = 0; }
          if (head[1] === s[1] && head[0] + 1 === s[0]) {canMoveForward = -1;}
          if (head[1] - 1 === s[1] && head[0] === s[0]) {canMoveLeft = 0;}
          if (head[1] + 1 === s[1] && head[0] === s[0]) {canMoveRight = 0; }
        })
      this.flat.forEach(s => {
          // if (head[1] === s[1] && head[0] + 2 === s[0]) {canMoveForward = 0;}
          // if (head[1] - 2 === s[1] && head[0] === s[0]) {canMoveLeft = 0;}
          // if (head[1] + 2 === s[1] && head[0] === s[0]) {canMoveRight = 0; }
          if (head[1] === s[1] && head[0] + 1 === s[0]) {canMoveForward = -1;}
          if (head[1] - 1 === s[1] && head[0] === s[0]) {canMoveLeft = 0;}
          if (head[1] + 1 === s[1] && head[0] === s[0]) {canMoveRight = 0; }
        })
        break
    }

    // activate the neural network (aka "where the magic happens")
    
    const input = [canMoveForward, canMoveLeft, canMoveRight, isFoodForward, isFoodLeft, isFoodRight, this.history[1]]
    this.observations = input
    const output = this.brain.activate(input).map(o => Math.round(o))
    // set the new direction

    // if the snake cannot move forward and choses to move left or right - award points for near miss
    if (!canMoveForward && (output[0] || output[1]) && this.segments.length > 15){
      this.brain.score += 100
    }


    if (output[0]) { // turn left
      this.brain.score += isFoodLeft ? this.scoreModifiers.movedTowardsFood : this.scoreModifiers.movedAgainstFood
      this.history[0] = this.history[1]
      this.history[1] = 1
      switch (this.direction) {
        case 'up': this.direction = 'left'; break
        case 'down': this.direction = 'right'; break
        case 'left': this.direction = 'down'; break
        case 'right': this.direction = 'up'; break
      }
    } else if (output[1]) { // turn right
      this.brain.score += isFoodRight ? this.scoreModifiers.movedTowardsFood : this.scoreModifiers.movedAgainstFood
      this.history[0] = this.history[1]
      this.history[1] = -1
      switch (this.direction) {
        case 'up': this.direction = 'right'; break
        case 'down': this.direction = 'left'; break
        case 'left': this.direction = 'up'; break
        case 'right': this.direction = 'down'; break
      }
    } else { // go forward
      this.brain.score += isFoodForward ? this.scoreModifiers.movedTowardsFood : this.scoreModifiers.movedAgainstFood
    }

    // move the snake
    
    if (this.isEating) {
      switch (this.direction) {
        case 'up': this.segments.push([head[0], head[1] - 1]); break
        case 'down': this.segments.push([head[0], head[1] + 1]); break
        case 'left': this.segments.push([head[0] - 1, head[1]]); break
        case 'right': this.segments.push([head[0] + 1, head[1]]); break
      }

      this.isEating = false
    } else {

      this.hungrySteps += 1
      for (let i = 0; i < this.segments.length - 1; i++) {
        this.segments[i][0] = this.segments[i + 1][0]
        this.segments[i][1] = this.segments[i + 1][1]
      }

      head = this.segments[this.segments.length - 1]

      switch (this.direction) {
        case 'up':
          head[0] = this.segments[this.segments.length - 2][0]
          head[1] = this.segments[this.segments.length - 2][1] - 1
          break
        case 'down':
          head[0] = this.segments[this.segments.length - 2][0]
          head[1] = this.segments[this.segments.length - 2][1] + 1
          break
        case 'left':
          head[0] = this.segments[this.segments.length - 2][0] - 1
          head[1] = this.segments[this.segments.length - 2][1]
          break
        case 'right':
          head[0] = this.segments[this.segments.length - 2][0] + 1
          head[1] = this.segments[this.segments.length - 2][1]
          break
      }
    }

    head = this.segments[this.segments.length - 1]

    if (game.food.position[0] === head[0] && game.food.position[1] === head[1]) {
      this.isEating = true
      this.foodNumber++
      this.hungrySteps = 0;
      this.brain.score += this.scoreModifiers.ateFood
    }

  }

}
