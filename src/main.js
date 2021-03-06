const Neat = neataptic.Neat
const Config = neataptic.Config
var Node = neataptic.Node;
var Network = neataptic.Network;
var Methods = neataptic.Methods;
var Architect = neataptic.Architect;

Config.warnings = false


// defining neat constructor
const neat = new Neat(7, 2, null, {
    popsize: GAMES,
    elitism: ELITISM,
    mutationRate: MUTATION_RATE,
    mutationAmount: MUTATION_AMOUNT
  }
)

const chartData = {
  labels: [],
  datasets: [
    {
      name: 'Max',
      values: []
    },
    {
      name: 'Average',
      values: []
    },
    {
      name: 'Min',
      values: []
    },
    {
      name: 'highest eaten',
      values: []
    }
  ]
}

const chart = new Chart('#chart', {
  title: 'generation score history',
  type: 'line',
  height: 500,
  width: 1000,
  data: chartData
})

let highestScore = 0

const runner = new Runner({
  neat,
  games: GAMES,
  gameSize: GAME_SIZE,
  gameUnit:  GAME_UNIT,
  frameRate: FRAME_RATE,
  maxTurns: MAX_TURNS,
  lowestScoreAllowed: LOWEST_SCORE_ALLOWED,
  score: {
    movedTowardsFood: POINTS_MOVED_TOWARDS_FOOD,
    movedAgainstFood: POINTS_MOVED_AGAINST_FOOD,
    ateFood: POINTS_ATE_FOOD,
    death: DEATH_BY_BITE
  },


  // chart generation
  onEndGeneration: ({generation, max, avg, min, network, highestEaten}) => {
    drawGraph(network.graph(300, 300), '.draw');
    chartData.labels.push(generation.toString())
    chartData.datasets[0].values.push(max)
    chartData.datasets[1].values.push(avg)
    chartData.datasets[2].values.push(min)
    chartData.datasets[3].values.push(highestEaten)

    if (chartData.labels.length > 200) {
      chartData.labels.shift()
      chartData.datasets.forEach(d => d.values.shift())
    }

    chart.update(chartData)
    if (max > highestScore) {
      highestScore = max
    }

    document.getElementById('generation').innerHTML = generation
    document.getElementById('highest-score').innerHTML = highestScore
    console.log("generation", generation)
    console.log("max", max, "min", min, "avg", avg)
  }
})

runner.startGeneration()

function saveData() {
  var vals = chartData.datasets[0].values;
  var string="";

  for(var i=1; i<vals.length; i++) {
    string =  string + "(" +  i + ","+ vals[i] + ")";
  }
  $('textarea#data-well').text(string);

 

}

function saveData2() {
  var vals = chartData.datasets[3].values;
  var string="";

  for(var i=1; i<vals.length; i++) {
    string =  string + "(" +  i + ","+ vals[i] + ")";
  }
  $('textarea#data-well').text(string);
}