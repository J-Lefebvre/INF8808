
/**
 *
 */
export function generateViz3 () {
  // Split container in two
  var container = d3.select('#grouped-quantile-graph-container')
  var delayGraphContainer = container.append('div')
    .style('width', '50%')
    .style('height', '100%')
    .style('float', 'left')
  var trafficGraphContainer = container.append('div')
    .style('width', '50%')
    .style('height', '100%')
    .style('float', 'right')

  // TODO: Fetch data
  var data = {}
  data.lines = ['9', '22']
  data.directions = ['Lafontaine', 'Montmorency', 'Côté', 'George VI']

  // Regenerate graphs on resize
  new ResizeObserver(() => { generateDelayGraph(delayGraphContainer, data) })
    .observe(delayGraphContainer.node())
  new ResizeObserver(() => { generateTrafficGraph(trafficGraphContainer, data) })
    .observe(trafficGraphContainer.node())
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 */
export function generateDelayGraph (container, data) {
  // TODO: Fetch data
  data.quantileSets = [
    [10, 20, 30, 40, 50],
    [-5, 25, 40, 50, 70],
    [15, 20, 55, 60, 65],
    [40, 50, 60, 70, 90]
  ]

  // Generate common graph
  data.title = 'Retard Moyen'
  var svg = generateGroupedQuantileGraph(container, data)
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 */
export function generateTrafficGraph (container, data) {
  // TODO: Fetch data
  data.quantileSets = [
    [100, 200, 300, 350, 500],
    [50, 200, 250, 600, 650],
    [200, 350, 400, 600, 700],
    [450, 500, 600, 700, 750]
  ]

  // Generate common graph
  data.title = 'Achalandage Moyen'
  var svg = generateGroupedQuantileGraph(container, data)
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to display
 * @returns {Selection} The generated graph as svg
 */
export function generateGroupedQuantileGraph (container, data) {
  const MARGIN = { top: 100, right: 80, bottom: 150, left: 150 }
  const FONT_SIZE = 16
  const DIRECTIONS_ANGLE = -45
  const QUANTILE_STROKE_COLOR = 'gray'
  const QUANTILE_STROKE_WIDTH = 2
  const NUMBER_OF_TICKS = 10

  // ===================== SETUP =====================

  // Delete existing content
  container.html('')
  // Set size
  var WIDTH = container.node().getBoundingClientRect().width
  var HEIGHT = container.node().getBoundingClientRect().height
  var BAR_WIDTH = (WIDTH - MARGIN.left - MARGIN.right) / 7
  // Create svg
  var svg = container.append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)

  // ===================== SCALES =====================

  // Create lines scale
  var linesScale = d3.scaleOrdinal()
    .domain(data.lines)
    .range([MARGIN.left + 2 * BAR_WIDTH, MARGIN.left + 5 * BAR_WIDTH])
  // Create directions scale
  var directionsRange = []
  for (const line of data.lines) {
    directionsRange.push(linesScale(line) - BAR_WIDTH / 2)
    directionsRange.push(linesScale(line) + BAR_WIDTH / 2)
  }
  var directionsScale = d3.scaleOrdinal()
    .domain([...data.directions])
    .range(directionsRange)
  // Create data scale
  var maxValue = Number.MIN_SAFE_INTEGER
  var minValue = Number.MAX_SAFE_INTEGER
  for (const quantiles of data.quantileSets) {
    for (const quantile of quantiles) {
      if (maxValue < quantile) {
        maxValue = quantile
      }
      if (minValue > quantile) {
        minValue = quantile
      }
    }
  }
  var dataScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([HEIGHT - MARGIN.bottom - BAR_WIDTH / 2, MARGIN.top])

  // ===================== X AXIS =====================

  var xAxis = svg.append('g')
    .attr('id', 'x-axis')
  // Draw axis line
  xAxis.append('path')
    .attr('d', d3.line()([
      [MARGIN.left, HEIGHT - MARGIN.bottom],
      [MARGIN.left + 7 * BAR_WIDTH, HEIGHT - MARGIN.bottom]
    ]))
    .attr('stroke', 'black')
  // Draw line values
  const lineValuesY = HEIGHT - MARGIN.bottom + FONT_SIZE * 1.5
  for (const line of data.lines) {
    xAxis.append('text')
      .attr('x', linesScale(line))
      .attr('y', lineValuesY)
      .attr('text-anchor', 'middle')
      .text(line)
      .style('font-size', FONT_SIZE)
  }
  // Draw direction values
  const directionValuesY = lineValuesY + FONT_SIZE
  for (const direction of data.directions) {
    const x = directionsScale(direction)
    xAxis.append('text')
      .attr('text-anchor', 'end')
      .attr('transform', `translate(${x}, ${directionValuesY}) rotate(${DIRECTIONS_ANGLE})`)
      .text(direction)
      .style('font-size', FONT_SIZE)
  }
  // Draw labels
  xAxis.append('text')
    .attr('x', WIDTH - MARGIN.right + FONT_SIZE / 2)
    .attr('y', lineValuesY)
    .text('Ligne')
    .style('font-size', FONT_SIZE)
  xAxis.append('text')
    .attr('x', WIDTH - MARGIN.right + FONT_SIZE / 2)
    .attr('y', directionValuesY + FONT_SIZE)
    .text('Direction')
    .style('font-size', FONT_SIZE)

  // ===================== Y AXIS =====================

  var yAxis = svg.append('g')
    .attr('id', 'y-axis')
  // Draw axis line
  yAxis.append('path')
    .attr('d', d3.line()([
      [MARGIN.left, MARGIN.top],
      [MARGIN.left, HEIGHT - MARGIN.bottom]
    ]))
    .attr('stroke', 'black')
  // Generate steps
  var steps = getSteps(10, dataScale.domain)
  for (const step of steps) {
    const y = dataScale(step)
    // Draw data values
    yAxis.append('text')
      .attr('text-anchor', 'end')
      .attr('x', MARGIN.left - FONT_SIZE)
      .attr('y', y + FONT_SIZE / 2)
      .text(step)
      .style('font-size', FONT_SIZE)
    // Draw ticks
    yAxis.append('path')
      .attr('d', d3.line()([
        [MARGIN.left - FONT_SIZE / 2, y],
        [MARGIN.left, y]]
      ))
      .attr('stroke', QUANTILE_STROKE_COLOR)
      .attr('stroke-width', QUANTILE_STROKE_WIDTH)
  }
  // Draw labels
  yAxis.append('text')
    .attr('x', MARGIN.left)
    .attr('y', MARGIN.top - FONT_SIZE / 2)
    .attr('text-anchor', 'end')
    .text('Unité de données')
    .style('font-size', FONT_SIZE)

  // ===================== CANDLES =====================

  var bars = svg.append('g')
    .attr('id', 'candles')
  for (let i = 0; i < data.quantileSets.length; i++) {
    const x = directionsScale(data.directions[i])
    const top = dataScale(data.quantileSets[i][4])
    const q3 = dataScale(data.quantileSets[i][3])
    const q2 = dataScale(data.quantileSets[i][2])
    const q1 = dataScale(data.quantileSets[i][1])
    const bottom = dataScale(data.quantileSets[i][0])
    // Draw domain line
    bars.append('path')
      .attr('d', d3.line()([[x, top], [x, bottom]]))
      .attr('stroke', QUANTILE_STROKE_COLOR)
      .attr('stroke-width', QUANTILE_STROKE_WIDTH)
    // Draw Q1 to Q3 bar
    bars.append('rect')
      .attr('width', BAR_WIDTH)
      .attr('x', x - BAR_WIDTH / 2)
      .attr('height', q1 - q3)
      .attr('y', q3)
      .attr('fill', 'white')
      .attr('stroke', QUANTILE_STROKE_COLOR)
      .attr('stroke-width', QUANTILE_STROKE_WIDTH * 2)
    // Draw Q2 line
    bars.append('path')
      .attr('d', d3.line()([[x - BAR_WIDTH / 2, q2], [x + BAR_WIDTH / 2, q2]]))
      .attr('stroke', QUANTILE_STROKE_COLOR)
      .attr('stroke-width', QUANTILE_STROKE_WIDTH)
  }

  // ===================== OTHER =====================

  // Draw Title
  svg.append('text')
    .attr('x', (WIDTH - MARGIN.right - MARGIN.left) / 2 + MARGIN.left)
    .attr('y', MARGIN.top - FONT_SIZE * 2)
    .attr('text-anchor', 'middle')
    .text(data.title)
    .style('font-size', FONT_SIZE)

  return svg
}

/**
 * @param {number} nSteps The ideal number of ticks
 * @param {object} domain Domain of d3 scale
 * @returns {number} The best step to use
 */
export function getClosestStep (nSteps, domain) {
  const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000]
  var step = (domain[1] - domain[0]) / nSteps
  var stepDiff = []
  var bestStep = STEPS[STEPS.length - 1]
  for (let i = 0; i < STEPS.length; i++) {
    stepDiff.push(Math.abs(STEPS[i] - step))
    if (i > 0 && stepDiff[i] > stepDiff[i - 1]) {
      bestStep = STEPS[i - 1]
      break
    }
  }
  return bestStep
}

/**
 * @param {number} nSteps The ideal number of steps
 * @param {object} domain Domain of d3 scale
 * @returns {Array<number>} The best steps
 */
export function getSteps (nSteps, domain) {
  var step = getClosestStep(nSteps, domain)
  var steps = []
  if (domain[0] <= 0 && domain[1] >= 0) {
    steps.push(0)
  } else {
    steps.push(domain[0])
  }
  while (steps[steps.length - 1] < domain[1] - step) {
    steps.push(steps[steps.length - 1] + step)
  }
  while (steps[0] > domain[0] + step) {
    steps.unshift(steps[0] - step)
  }
  return steps
}
