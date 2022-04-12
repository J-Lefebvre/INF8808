const FONT_SIZE = 16
const BAR_STROKE_COLOR = '#8DBA74'
const BAR_FILL_COLOR = '#D5E8D4'
const BAR_STROKE_WIDTH = 2

/**
 *
 */
export function generateViz2 (data) {
    var container = d3.select('#candlestick-graph-container')
    var candlestickContainer = container.append('div')
        .style('width', '100%')
        .style('height', '50%')
    var barGraphContainer = container.append('div')
        .style('width', '100%')
        .style('height', '50%')

    // TODO: Fetch data
    var stops = []
    var amounts = []
    let stopsList = data[0].girouettes[0].voyages[0].arrets
    for(let stop in stopsList) {
        stops.push(stopsList[stop]["nomArret"])
        amounts.push(Math.floor(Math.random() * 70))
    }
		data = {}
		data.stops = stops
		data.amounts = amounts
    console.log(data.stops)
    console.log(data.amounts)

    // Regenerate graphs on resize
   // new ResizeObserver(() => { generateTopGraph(candlestickContainer, data) })
    //    .observe(candlestickContainer.node())
    new ResizeObserver(() => { generateBottomGraph(barGraphContainer, data) })
        .observe(barGraphContainer.node())
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 */
export function generateBottomGraph (container, data) {
  // Generate common graph
  data.title = 'Achalandage Moyen'
  var [svg] = generateBarGraph(container, data)
  // Set y axis label
  svg.select('#y-axis > .label')
    .text('Nombre de personnes\npar jour')
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to display
 * @returns {Selection} The generated graph as svg
 */
export function generateBarGraph (container, data) {
  // ===================== SETUP =====================
  
  // Delete existing content
  container.html('')
  // Set size
  var width = container.node().getBoundingClientRect().width
  var height = container.node().getBoundingClientRect().height
  // Create svg
	var margin = {top: 100, right: 100, bottom: 200, left: 100}
	var BAR_WIDTH = (width - margin.left - margin.right) / data.stops.length
  var svg = container.append('svg')
		.attr("width", width)
		.attr("height", height)

  // ===================== OTHER =====================

	// X axis
	var xScale = d3.scaleBand()
		.range([ margin.left, width - margin.right])
		.domain(data.stops)
		.padding(0.4)
	svg.append("g")
		.attr("transform", "translate(0," + (height-margin.bottom) + ")")
		.call(d3.axisBottom(xScale))
		.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

	//X Title
	svg.append("text")
		.attr("transform", "translate(" + (width-margin.right) + "," + (height-margin.bottom + 25) + ")")
		.text('Arrêt')
		.attr('fill', '#898989')
		.attr('font-size', 12)

	// Add Y axis
	var yScale = d3.scaleLinear()
		.domain([0, 70])
		.range([height - margin.bottom, margin.top]);
	svg.append("g")
		.attr("transform", "translate(" + margin.left + ", 0 )")
		.call(d3.axisLeft(yScale));

	//Y Title
	svg.append("text")
	.attr("transform", "translate(" + (margin.right - 80) + "," + (margin.top - 10) + ")")
	.append('tspan')
	.attr('x', 0)
	.attr('dy', 5)
	.text('Nombre')
	.attr('fill', '#898989')
	.attr('font-size', 12)
	.append('tspan')
	.attr('x', 0)
	.attr('dy', 10)
	.text('de')
	.append('tspan')
	.attr('x', 0)
	.attr('dy', 10)
	.text('personnes')

	// Bars
	var bars = svg.append('g')
	.attr('id', 'bars')
  for (let i = 0; i < data.amounts.length; i++) {
    const x = xScale(data.stops[i])
    const y = yScale(data.amounts[i])
    bars.append('rect')
			.attr('x', x)
			.attr('width', xScale.bandwidth())
      .attr('height', yScale(0) - y)
      .attr('y', y)
      .attr('fill', BAR_FILL_COLOR)
      .attr('stroke', BAR_STROKE_COLOR)
      .attr('stroke-width', BAR_STROKE_WIDTH)
  }
  // Draw Title
  svg.append('text')
    .attr('x', (width - margin.right - margin.left) / 2 + margin.left)
    .attr('y', margin.top - FONT_SIZE * 2)
    .attr('text-anchor', 'middle')
    .text(data.title)
    .style('font-size', FONT_SIZE)
  return [svg]
}