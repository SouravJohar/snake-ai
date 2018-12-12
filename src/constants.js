// game settings

const GAMES = 60
const GAME_SIZE = 200
const GAME_UNIT = 5
const FRAME_RATE = 120

// game bottlenecks

const MAX_TURNS = 5000
const LOWEST_SCORE_ALLOWED = -500

// neural network settings

const MUTATION_RATE = 0.5
const MUTATION_AMOUNT = 3
const ELITISM = Math.round(0.2 * GAMES)

// score settings

const POINTS_MOVED_TOWARDS_FOOD = 1
const POINTS_MOVED_AGAINST_FOOD = 0
const POINTS_ATE_FOOD = 2
const DEATH_BY_WALL = 0
const DEATH_BY_BITE = 0
const TIME_ALIVE = 0
// add a score for moving too close to tail
