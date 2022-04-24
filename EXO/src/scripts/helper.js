
/**
 * Generates the SVG element g which will contain the map base.
 *
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 * @returns {*} The d3 Selection for the created g element
 */
export function generateMapG (width, height) {
  return d3.select('.graph')
    .select('svg')
    .append('g')
    .attr('id', 'map-g')
    .attr('width', width)
    .attr('height', height)
}

/**
 * Generates the SVG element g which will contain the map markers.
 *
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 * @returns {*} The d3 Selection for the created g element
 */
export function generateMarkerG (width, height) {
  return d3.select('.graph')
    .select('svg')
    .append('g')
    .attr('id', 'marker-g')
    .attr('width', width)
    .attr('height', height)
}

/**
 * Sets the size of the SVG canvas containing the graph.
 *
 * @param {number} width The desired width
 * @param {number} height The desired height
 */
export function setCanvasSize (width, height) {
  d3.select('#map').select('svg')
    .attr('width', width)
    .attr('height', height)
}


/**
 * @param {number} nSteps The ideal number of steps
 * @param {*} domain Domain of d3 scale
 * @returns {number} The best step to use
 */
export function getClosestStep (nSteps, domain) {
  const BEST_STEPS = [
    0.1, 0.2, 0.25, 0.5,
    1, 2, 2.5, 5,
    10, 20, 25, 50,
    100, 200, 250, 500,
    1000, 2000, 2500, 5000,
    10000, 20000, 25000, 50000
  ]
  var step = (domain[1] - domain[0]) / nSteps
  var stepDiff = []
  var bestStep = BEST_STEPS[BEST_STEPS.length - 1]
  for (let i = 0; i < BEST_STEPS.length; i++) {
    stepDiff.push(Math.abs(BEST_STEPS[i] - step))
    if (i > 0 && stepDiff[i] > stepDiff[i - 1]) {
      bestStep = BEST_STEPS[i - 1]
      break
    }
  }
  return bestStep
}

/**
 * @param {number} nSteps The ideal number of steps
 * @param {*} domain Domain of d3 scale
 * @returns {Array<number>} The best steps
 */
export function getSteps (nSteps, domain) {
  var step = getClosestStep(nSteps, domain)
  var steps = []
  if (domain[0] <= 0 && domain[1] >= 0) {
    steps.push(0)
  } else {
    let firstStep = Math.floor(domain[0])
    while (firstStep % step !== 0) {
      firstStep += 1
    }
    steps.push(firstStep)
  }
  while (steps[steps.length - 1] < domain[1] - step) {
    steps.push(steps[steps.length - 1] + step)
  }
  while (steps[0] > domain[0] + step) {
    steps.unshift(steps[0] - step)
  }
  return steps
}

/**
 * @param {Array<number>} array Array of numeric values
 * @returns {Array<number>} The quantiles
 */
export function getQuantiles (array) {
  array = array.sort(d3.ascending)
  const quantiles = [
    array[0],
    d3.quantile(array, 0.25),
    d3.median(array),
    d3.quantile(array, 0.75),
    array[array.length - 1]
  ]
  return quantiles
}

/**
 * @param {Date} d date
 * @returns {number} weekNo
 */
export function getWeekNumber (d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo]
}
