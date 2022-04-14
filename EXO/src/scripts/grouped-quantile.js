import * as helper from './helper.js'

const MARGIN = { top: 52, right: 100, bottom: 150, left: 100 }
const FONT_SIZE = 16
const DIRECTIONS_ANGLE = -45
const QUANTILE_STROKE_COLOR = 'black'
const QUANTILE_FILL_COLOR = 'lightgray'
const QUANTILE_STROKE_WIDTH = 2
const NUMBER_OF_TICKS = 10
const GRADIENT_COLORS = ['#ff9999', '#99ff99', '#ffff99']
const GRADIENT_THRESHOLDS = ['15', '10', '0', '-5']

/**
 *
 */
export function generateViz3 (vizData) {
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
  new ResizeObserver(() => { generateDelayGraph(delayGraphContainer, data, vizData) })
    .observe(delayGraphContainer.node())
  new ResizeObserver(() => { generateTrafficGraph(trafficGraphContainer, data, vizData) })
    .observe(trafficGraphContainer.node())
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 */
export function generateDelayGraph (container, data, vizData) {
  // Fetch data
  data.quantileSets = getQuantileSets(vizData, 'moyMinutesEcart')
  console.log(data.quantileSets)

  // Generate common graph
  data.title = 'Retard Moyen'
  var [svg, dataScale] = generateGroupedQuantileGraph(container, data)
  var WIDTH = container.node().getBoundingClientRect().width
  var HEIGHT = container.node().getBoundingClientRect().height

  // Set gradients
  svg.append('defs')
    .append('linearGradient')
    .attr('id', 'late-grad')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '0%')
    .attr('y2', '100%')
    .selectAll('stop')
    .data([GRADIENT_COLORS[0], GRADIENT_COLORS[1]])
    .enter()
    .append('stop')
    .style('stop-color', function (d) { return d })
    .attr('offset', function (d, i) { return 100 * i + '%' })
  svg.append('defs')
    .append('linearGradient')
    .attr('id', 'early-grad')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '0%')
    .attr('y2', '100%')
    .selectAll('stop')
    .data([GRADIENT_COLORS[1], GRADIENT_COLORS[2]])
    .enter()
    .append('stop')
    .style('stop-color', function (d) { return d })
    .attr('offset', function (d, i) { return 100 * i + '%' })
  // Draw gradients
  svg.insert('rect', '#x-axis')
    .attr('width', WIDTH - MARGIN.left - MARGIN.right)
    .attr('x', MARGIN.left)
    .attr('height', dataScale(GRADIENT_THRESHOLDS[0]) - MARGIN.top)
    .attr('y', MARGIN.top)
    .attr('fill', GRADIENT_COLORS[0])
  svg.insert('rect', '#x-axis')
    .attr('width', WIDTH - MARGIN.left - MARGIN.right)
    .attr('x', MARGIN.left)
    .attr('height', dataScale(GRADIENT_THRESHOLDS[1]) - dataScale(GRADIENT_THRESHOLDS[0]))
    .attr('y', dataScale(GRADIENT_THRESHOLDS[0]))
    .attr('fill', 'url(#late-grad)')
  svg.insert('rect', '#x-axis')
    .attr('width', WIDTH - MARGIN.left - MARGIN.right)
    .attr('x', MARGIN.left)
    .attr('height', dataScale(GRADIENT_THRESHOLDS[2]) - dataScale(GRADIENT_THRESHOLDS[1]))
    .attr('y', dataScale(GRADIENT_THRESHOLDS[1]))
    .attr('fill', GRADIENT_COLORS[1])
  svg.insert('rect', '#x-axis')
    .attr('width', WIDTH - MARGIN.left - MARGIN.right)
    .attr('x', MARGIN.left)
    .attr('height', dataScale(GRADIENT_THRESHOLDS[3]) - dataScale(GRADIENT_THRESHOLDS[2]))
    .attr('y', dataScale(GRADIENT_THRESHOLDS[2]))
    .attr('fill', 'url(#early-grad)')
  svg.insert('rect', '#x-axis')
    .attr('width', WIDTH - MARGIN.left - MARGIN.right)
    .attr('x', MARGIN.left)
    .attr('height', HEIGHT - MARGIN.bottom - dataScale(GRADIENT_THRESHOLDS[3]))
    .attr('y', dataScale(GRADIENT_THRESHOLDS[3]))
    .attr('fill', GRADIENT_COLORS[2])

  // Set y axis label
  svg.select('#y-axis > .label')
    .text('Minute')

  // Legend
  const legend = svg.insert('g', '#x-axis')
  const middleY = (HEIGHT - MARGIN.top - MARGIN.bottom) / 2 + MARGIN.top
  const squareWidth = FONT_SIZE * 2 / 3
  const paddingX = FONT_SIZE * 2
  const paddingY = FONT_SIZE * 1.5
  legend.append('rect')
    .attr('width', squareWidth)
    .attr('x', WIDTH - MARGIN.right + FONT_SIZE)
    .attr('height', squareWidth)
    .attr('y', middleY - paddingY)
    .attr('stroke', QUANTILE_STROKE_COLOR)
    .attr('fill', GRADIENT_COLORS[0])
  legend.append('text')
    .attr('x', WIDTH - MARGIN.right + paddingX)
    .attr('y', middleY - paddingY + squareWidth)
    .text('Retard')
  legend.append('rect')
    .attr('width', squareWidth)
    .attr('x', WIDTH - MARGIN.right + FONT_SIZE)
    .attr('height', squareWidth)
    .attr('y', middleY)
    .attr('stroke', QUANTILE_STROKE_COLOR)
    .attr('fill', GRADIENT_COLORS[1])
  legend.append('text')
    .attr('x', WIDTH - MARGIN.right + paddingX)
    .attr('y', middleY + squareWidth)
    .text('Ponctuel')
  legend.append('rect')
    .attr('width', squareWidth)
    .attr('x', WIDTH - MARGIN.right + FONT_SIZE)
    .attr('height', squareWidth)
    .attr('y', middleY + paddingY)
    .attr('stroke', QUANTILE_STROKE_COLOR)
    .attr('fill', GRADIENT_COLORS[2])
  legend.append('text')
    .attr('x', WIDTH - MARGIN.right + paddingX)
    .attr('y', middleY + paddingY + squareWidth)
    .text('Avance')
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 */
export function generateTrafficGraph (container, data, vizData) {
  // Fetch data
  console.log(vizData)
  data.quantileSets = data.quantileSets = getQuantileSets(vizData, 'moyMinutesEcart')

  // Generate common graph
  data.title = 'Achalandage Moyen'
  var [svg] = generateGroupedQuantileGraph(container, data)
  // Set y axis label
  svg.select('#y-axis > .label')
    .text('Nombre de personnes\npar jour')
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to display
 * @returns {Selection} The generated graph as svg
 */
export function generateGroupedQuantileGraph (container, data) {
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
    .range([HEIGHT - MARGIN.bottom - FONT_SIZE, MARGIN.top])

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
  for (let i = 0; i < data.directions.length; i++) {
    const x = directionsScale(data.directions[i])
    xAxis.append('text')
      .attr('text-anchor', 'end')
      .attr('transform', `translate(${x}, ${directionValuesY}) rotate(${DIRECTIONS_ANGLE})`)
      .text(data.directions[i])
      .style('font-size', FONT_SIZE)
      .attr('class', `direction${i} label`)
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
  var steps = helper.getSteps(NUMBER_OF_TICKS, dataScale.domain())
  for (const step of steps) {
    const y = dataScale(step)
    // Draw data values
    yAxis.append('text')
      .attr('text-anchor', 'end')
      .attr('x', MARGIN.left - FONT_SIZE)
      .attr('y', y + FONT_SIZE / 3)
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
    .attr('x', MARGIN.left - FONT_SIZE / 2)
    .attr('y', MARGIN.top - FONT_SIZE / 2)
    .attr('class', 'label')
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
      .attr('class', `direction${i}`)
    // Draw Q1 to Q3 bar
    bars.append('rect')
      .attr('width', BAR_WIDTH)
      .attr('x', x - BAR_WIDTH / 2)
      .attr('height', q1 - q3)
      .attr('y', q3)
      .attr('fill', QUANTILE_FILL_COLOR)
      .attr('stroke', QUANTILE_STROKE_COLOR)
      .attr('stroke-width', QUANTILE_STROKE_WIDTH)
      .attr('class', `direction${i}`)
    // Draw Q2 line
    bars.append('path')
      .attr('d', d3.line()([[x - BAR_WIDTH / 2, q2], [x + BAR_WIDTH / 2, q2]]))
      .attr('stroke', QUANTILE_STROKE_COLOR)
      .attr('stroke-width', QUANTILE_STROKE_WIDTH)
      .attr('class', `direction${i}`)
    // Draw quantile values
    for (let j = 0; j < data.quantileSets[i].length; j++) {
      const quantile = bars.append('g')
        .attr('class', `direction${i} quantile`)
        .style('visibility', 'hidden')
      const x = directionsScale(data.directions[i]) + (i % 2 === 0 ? -1 : 1) * (BAR_WIDTH / 2 + FONT_SIZE / 2)
      const y = dataScale(data.quantileSets[i][j])
      quantile.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', (i % 2 === 0 ? 'end' : 'start'))
        .text(data.quantileSets[i][j])
        .style('font-size', FONT_SIZE)
        .attr('id', `quantile-text-${i}-${j}`)
    }
  }

  // ===================== HOVER =====================

  // Create triggers
  for (let i = 0; i < data.directions.length; i++) {
    bars.append('rect')
      .attr('width', BAR_WIDTH)
      .attr('x', directionsScale(data.directions[i]) - BAR_WIDTH / 2)
      .attr('height', dataScale.range()[0] - dataScale.range()[1] + FONT_SIZE)
      .attr('y', MARGIN.top)
      .attr('fill', 'transparent')
      // Highlight direction
      .on('mouseover', () => {
        d3.selectAll(`.direction${i}`)
          .attr('stroke-width', QUANTILE_STROKE_WIDTH * 2)
        d3.selectAll(`.direction${i}.label`)
          .style('font-size', FONT_SIZE * 1.5)
        d3.selectAll(`.direction${i}.quantile`)
          .style('visibility', 'visible')
      // Unhighlight direction
      }).on('mouseout', () => {
        d3.selectAll(`.direction${i}`)
          .attr('stroke-width', QUANTILE_STROKE_WIDTH)
        d3.selectAll(`.direction${i}.label`)
          .style('font-size', FONT_SIZE)
        d3.selectAll(`.direction${i}.quantile`)
          .style('visibility', 'hidden')
      })
  }

  // ===================== OTHER =====================

  // Draw Title
  svg.append('text')
    .attr('x', (WIDTH - MARGIN.right - MARGIN.left) / 2 + MARGIN.left)
    .attr('y', MARGIN.top - FONT_SIZE * 2)
    .attr('text-anchor', 'middle')
    .text(data.title)
    .style('font-size', FONT_SIZE)

  return [svg, dataScale]
}

/**
 * @param {object} vizData Project data
 * @param {string} attribute The stop's attribute to fetch
 * @returns {Array<number>} The quantile sets
 */
export function getQuantileSets (vizData, attribute) {
  const quantileSets = []
  for (const line of vizData) {
    for (const direction of line.girouettes) {
      const tripDelays = []
      for (const trip of direction.voyages) {
        for (const stop of trip.arrets) {
          tripDelays.push(stop[attribute])
        }
      }
      quantileSets.push(helper.getQuantiles(tripDelays))
    }
  }
  return quantileSets
}
