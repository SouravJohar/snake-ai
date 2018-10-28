// game settings

const GAMES = 60
const GAME_SIZE = 100
const GAME_UNIT = 5
const FRAME_RATE = 24

// game bottlenecks

const MAX_TURNS = 5000
const LOWEST_SCORE_ALLOWED = -50

// neural network settings

const MUTATION_RATE = 0.5
const MUTATION_AMOUNT = 3
const ELITISM = Math.round(0.2 * GAMES)

// score settings

const POINTS_MOVED_TOWARDS_FOOD = 1
const POINTS_MOVED_AGAINST_FOOD = -1.5
const POINTS_ATE_FOOD = 2
const DEATH_BY_WALL = -10
const DEATH_BY_BITE = -10
const TIME_ALIVE = 0.01
// add a score for moving too close to tail
