import * as helper from './helper.js'

const MARGIN = { top: 52, right: 80, bottom: 100, left: 80 }
const FONT_SIZE = 14
const DIRECTIONS_ANGLE = -45
const QUANTILE_STROKE_COLOR = 'black'
const QUANTILE_FILL_COLOR = 'lightgray'
const QUANTILE_STROKE_WIDTH = 2
const NUMBER_OF_TICKS = 10
const GRADIENT_COLORS = ['#ff9999', '#99ff99', '#ffff99']
const GRADIENT_THRESHOLDS = ['10', '5', '0', '-5']

var selectValue = ''

/**
 * @param vizData
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
 * @param vizData
 */
export function generateDelayGraph (container, data, vizData) {
  // Fetch data
  data.quantileSets = getDelayQuantileSets(vizData)

  // Generate common graph
  data.title = 'Retard Moyen'
  var [svg, dataScale] = generateGroupedQuantileGraph(container, data)
  var HEIGHT = container.node().getBoundingClientRect().height
  var WIDTH = Math.min(HEIGHT, container.node().getBoundingClientRect().width)

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
    .attr('fill', '#898989')

  // Legend
  const legend = svg.insert('g', '#x-axis').style('font-size', '12px')
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
 * @param vizData
 */
export function generateTrafficGraph (container, data, vizData) {
  // Fetch data
  const [quantileTripSets, quantileDaySets, quantileWeekSets] = getTrafficQuantileSets(vizData)
  if (selectValue === '') {
    data.quantileSets = quantileTripSets
  } else {
    if (selectValue === 'week') {
      data.quantileSets = quantileWeekSets
    } else if (selectValue === 'day') {
      data.quantileSets = quantileDaySets
    } else if (selectValue === 'trip') {
      data.quantileSets = quantileTripSets
    }
  }

  // Create select
  const weekOption = document.createElement('option')
  weekOption.value = 'week'
  weekOption.innerHTML = 'semaine'
  const dayOption = document.createElement('option')
  dayOption.value = 'day'
  dayOption.innerHTML = 'jour'
  const tripOption = document.createElement('option')
  tripOption.value = 'trip'
  tripOption.innerHTML = 'trajet'
  const select = document.createElement('select')
  select.appendChild(tripOption)
  select.appendChild(dayOption)
  select.appendChild(weekOption)
  if (selectValue !== '') {
    select.value = selectValue
  }
  select.addEventListener('change', function () {
    if (this.value === 'week') {
      data.quantileSets = quantileWeekSets
    } else if (this.value === 'day') {
      data.quantileSets = quantileDaySets
    } else if (this.value === 'trip') {
      data.quantileSets = quantileTripSets
    }
    selectValue = this.value
    setTrafficGraph(container, data, select)
  })
  // generate traffic graph
  setTrafficGraph(container, data, select)
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 * @param {object} select select
 */
export function setTrafficGraph (container, data, select) {
  // Generate common graph
  data.title = 'Achalandage Moyen'
  var [svg] = generateGroupedQuantileGraph(container, data)

  // Position select
  const top = svg.node().getBoundingClientRect().top + 30
  const left = svg.node().getBoundingClientRect().left + MARGIN.left - 70
  select.setAttribute('style', `position: absolute; top: ${top}px; left: ${left}px; font-size: 12px`)
  container.node().appendChild(select)

  // Label
  svg.select('#y-axis > .label')
    .text('')
  svg.select('#y-axis > .label')
    .append('tspan')
    .attr('x', (MARGIN.left - 1).toString())
    .attr('y', '13')
    .text('Nombre de')
  svg.select('#y-axis > .label')
    .append('tspan')
    .attr('x', (MARGIN.left + 9).toString())
    .attr('y', '25')
    .text('personnes par')
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
  var HEIGHT = container.node().getBoundingClientRect().height
  var WIDTH = Math.min(HEIGHT, container.node().getBoundingClientRect().width)
  var BAR_WIDTH = (WIDTH - MARGIN.left - MARGIN.right) / 7
  // Create svg
  var svg = container.append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .attr('style', 'display: block; margin: auto')

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
    .domain([Math.min(minValue, 0), maxValue])
    .range([HEIGHT - MARGIN.bottom - FONT_SIZE / 2, MARGIN.top + FONT_SIZE / 2])

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
      .attr('fill', '#898989')
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
      .style('font-size', '12px')
      .attr('font-family', 'sans-serif')
      .attr('class', `direction${i} label`)
  }
  // Draw labels
  xAxis.append('text')
    .attr('x', WIDTH - MARGIN.right + FONT_SIZE / 2)
    .attr('y', lineValuesY)
    .text('Ligne')
    .attr('fill', '#898989')
    .style('font-size', FONT_SIZE)
  xAxis.append('text')
    .attr('x', WIDTH - MARGIN.right + FONT_SIZE / 2)
    .attr('y', directionValuesY + FONT_SIZE)
    .text('Direction')
    .attr('fill', '#898989')
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
      .attr('font-family', 'sans-serif')
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
    .attr('fill', '#898989')
    .style('font-size', FONT_SIZE)

  // ===================== CANDLES =====================

  var bars = svg.append('g')
    .attr('id', 'candles')

  // HISTOGRAMME

  /* for (let i = 0; i < data.quantileSets.length; i++) {
    // Features of the histogram
    var histogram = d3.histogram()
      .domain(dataScale.domain())
      .thresholds(dataScale.ticks(50)) // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
      .value(d => d)
    const bins = histogram(data.quantileSets[i])
    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    var maxNum = 0
    for (const bin of bins) {
      if (bin.length > maxNum) {
        maxNum = bin.length
      }
    }
    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3.scaleLinear()
      .range([0, BAR_WIDTH])
      .domain([-maxNum, maxNum])
    // Add the shape to this svg!
    const areaGenerator = d3.area()
      .x0((d) => xNum(-d.length))
      .x1((d) => xNum(d.length))
      .y((d) => dataScale(d.x0))
      .curve(d3.curveStep)
    bars.append('path')
      .attr('transform', `translate(${directionsScale(data.directions[i]) - BAR_WIDTH / 2})`)
      .style('fill', '#69b3a2')
      .attr('d', areaGenerator(bins))
  } */

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
    const yValues = [0, 0, 0, 0, 0]
    const minOffset = 11
    const centerOffset = 4
    yValues[2] = dataScale(data.quantileSets[i][2]) + centerOffset
    yValues[3] = Math.min(yValues[2] - minOffset, dataScale(data.quantileSets[i][3]) + centerOffset)
    yValues[4] = Math.min(yValues[3] - minOffset, dataScale(data.quantileSets[i][4]) + centerOffset)
    yValues[1] = Math.max(yValues[2] + minOffset, dataScale(data.quantileSets[i][1]) + centerOffset)
    yValues[0] = Math.max(yValues[1] + minOffset, dataScale(data.quantileSets[i][0]) + centerOffset)
    for (let j = 0; j < data.quantileSets[i].length; j++) {
      const quantile = bars.append('g')
        .attr('class', `direction${i} quantile`)
        .style('visibility', 'hidden')
      const x = directionsScale(data.directions[i]) + (i % 2 === 0 ? -1 : 1) * (BAR_WIDTH / 2 + FONT_SIZE / 2)
      quantile.append('text')
        .attr('x', x)
        .attr('y', yValues[j])
        .attr('text-anchor', (i % 2 === 0 ? 'end' : 'start'))
        .text(Math.round(data.quantileSets[i][j]))
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
          .attr('font-weight', 1000)
        d3.selectAll(`.direction${i}.quantile`)
          .style('visibility', 'visible')
      // Unhighlight direction
      }).on('mouseout', () => {
        d3.selectAll(`.direction${i}`)
          .attr('stroke-width', QUANTILE_STROKE_WIDTH)
        d3.selectAll(`.direction${i}.label`)
          .attr('font-weight', 0)
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
 * @returns {Array<number>} The quantile sets
 */
export function getDelayQuantileSets (vizData) {
  const quantileSets = []
  const delaySets = [[], [], [], []]
  for (const day of vizData) {
    for (let i = 0; i < day.lignes.length; i++) {
      const line = day.lignes[i]
      for (let j = 0; j < line.girouettes.length; j++) {
        const direction = line.girouettes[j]
        for (const trip of direction.voyages) {
          for (const stop of trip.arrets) {
            delaySets[i * day.lignes.length + j].push(stop.minutesEcart)
          }
        }
      }
    }
  }
  for (const delaySet of delaySets) {
    quantileSets.push(helper.getQuantiles(delaySet))
  }
  return quantileSets
}

/**
 * @param {object} vizData Project data
 * @returns {Array<number>} The quantile sets
 */
export function getTrafficQuantileSets (vizData) {
  const tripSets = [[], [], [], []]
  const daySets = [[], [], [], []]
  const weekSets = [[], [], [], []]
  let lastWeek = helper.getWeekNumber(new Date(Date.parse(vizData[0].date)))[1]
  let weekClients = [0, 0, 0, 0]
  for (const day of vizData) {
    const week = helper.getWeekNumber(new Date(Date.parse(day.date)))[1]
    for (let i = 0; i < day.lignes.length; i++) {
      const line = day.lignes[i]
      for (let j = 0; j < line.girouettes.length; j++) {
        const direction = line.girouettes[j]
        let dayClients = 0
        for (const trip of direction.voyages) {
          let tripClients = 0
          for (const stop of trip.arrets) {
            tripClients += stop.nClients
          }
          dayClients += tripClients
          tripSets[i * day.lignes.length + j].push(tripClients)
        }
        daySets[i * day.lignes.length + j].push(dayClients)
        weekClients[i * day.lignes.length + j] += dayClients
      }
    }
    if (lastWeek !== week) {
      for (let i = 0; i < weekClients.length; i++) {
        weekSets[i].push(weekClients[i])
      }
      weekClients = [0, 0, 0, 0]
      lastWeek = week
    }
  }
  const quantileTripSets = []
  for (const tripSet of tripSets) {
    quantileTripSets.push(helper.getQuantiles(tripSet))
  }
  const quantileDaySets = []
  for (const daySet of daySets) {
    quantileDaySets.push(helper.getQuantiles(daySet))
  }
  const quantileWeekSets = []
  for (const weekSet of weekSets) {
    quantileWeekSets.push(helper.getQuantiles(weekSet))
  }
  return [quantileTripSets, quantileDaySets, quantileWeekSets]
}
