# snake-ai

A NEAT way to play the snake game. An agent which learns how to master the snake game through genetic evolution of Neural Networks.

## Inputs to the network

Most of these inputs are binary with the exception of the first one (takes the values 0, 1 and -1)

  - Can I move forward?
  - Can I move left?
  - Can I move right?
  - Is the food in front of me?
  - Is the food to my left?
  - Is the food to my right?
 
## Fitness function

Each snake is graded for how 'fit' it is and for every move it makes, it is awarded the following points, if they apply:

  - Points awarded if the snake moves towards the food: 1
  - Points awarded if the snake eats the food: 2
  - If the snake survived a 'near miss' situation: 100  (might want to reduce this)

There are other scenarios available in `src/constants.js` for which points may be awarded.

#### All points are multiplied by a scaling factor which depends on the length of the snake
[factor = max(1, 0.2 * snake_lenght)]
  
