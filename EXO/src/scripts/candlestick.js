const FONT_SIZE = 16
const BAR_FILL_COLOR = '#D5E8D4'
const BAR_STROKE_COLOR = '#8DBA74'
const BAR_FILL_COLOR_POSITIVE = '#D5E8D4'
const BAR_STROKE_COLOR_POSITIVE = '#8DBA74'
const BAR_STROKE_COLOR_NEGATIVE = '#C57471'
const BAR_FILL_COLOR_NEGATIVE = '#F8CECC'
const BAR_STROKE_WIDTH = 2

/**
 *
 */
export function generateViz2 (data, line, direction, trajectNumber) {
	var container = d3.select('#candlestick-graph-container')
	var topDiv = container.append('div')
		.style('width', '100%')
		.style('height', '65%')
	var candlestickContainer = topDiv.append('div')
			.style('width', '90%')
			.style('height', '100%')
			.style('float', 'left')
	var legendContainer = topDiv.append('div')
			.style('width', '10%')
			.style('height', '100%')
			.style('float', 'right')
	var barGraphContainer = container.append('div')
			.style('width', '90%')
			.style('height', '35%')

	// Fetch data
	var dataArray = getData(data, line, direction, trajectNumber);
	data.stops = dataArray[0]
	data.delay = dataArray[1]
	data.amounts = dataArray[2]
	
  // Regenerate graphs on resize
	new ResizeObserver(() => { generateTopGraph(candlestickContainer, data); setLegend(legendContainer); })
		.observe(candlestickContainer.node())
	new ResizeObserver(() => { generateBottomGraph(barGraphContainer, data) })
		.observe(barGraphContainer.node())
}

/**
 * @param ligne 
 * @param direction
 */
export function getData (vizData, line, direction, trajectNumber) {
	var posLigne = vizData.findIndex(e => e.ligne === line)
  var posGirouette = vizData[posLigne].girouettes.findIndex(e => e.girouette === direction)
	var posVoyage = vizData[posLigne].girouettes[posGirouette].voyages.findIndex(e => e.voyage === trajectNumber)
	var delayIndicater = "moyMinutesEcart";
	var ammountIndicater = "moyNClients";
	var delays = [];
	var amounts = [];
	var stops = [];

	for (var a = 0; a < vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.length; a++) {
		stops.push(vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[a]["nomArret"])
		var dataDelay = vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[a][delayIndicater]
		delays.push(dataDelay)
		var dataAmmount = vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[a][ammountIndicater]
		amounts.push(dataAmmount)
	}
	return [stops, delays, amounts]
}

/**
 * @param {Selection} container The div to generate the graph in
 */
 export function setLegend (container) {
	container.html('')
	var legendWidth = container.node().getBoundingClientRect().width
  var legendHeight = container.node().getBoundingClientRect().height * 0.20
	var svgLegend = container.append('svg')
		.attr('width', legendWidth)
		.attr('height', legendHeight)
		.attr("style", "outline: thin solid black;")

	svgLegend.append("text")
		.attr('x', legendWidth/2)
		.attr('y', 25)
		.attr('dominant-baselin', 'middle')
		.attr('text-anchor', 'middle')
		.text("Légende")
		.attr('fill', '#black')
		.attr('font-size', "1em")

	svgLegend.append('svg')
		.append('rect')
		.attr('transform', 'translate(' + 10 + ', 50)')
		.attr('fill', BAR_FILL_COLOR_NEGATIVE)
		.attr('stroke', BAR_STROKE_COLOR_NEGATIVE)
		.attr('width', 25)
		.attr('height', 25)

	svgLegend.append("text")
		.attr('transform', 'translate(' + 40 + ', 65)')
		.text("Gain du retard")
		.attr('fill', '#black')
		.attr('font-size', "1em")

	svgLegend.append('svg')
		.append('rect')
		.attr('transform', 'translate(' + 10 + ', 85)')
		.attr('fill', BAR_FILL_COLOR_POSITIVE)
		.attr('stroke', BAR_STROKE_COLOR_POSITIVE)
		.attr('width', 25)
		.attr('height', 25)

	svgLegend.append("text")
		.attr('transform', 'translate(' + 40 + ', 100)')
		.text("Perte du retard")
		.attr('fill', '#black')
		.attr('font-size', "1em")
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 */
 export function generateTopGraph (container, data) {
  // Generate common graph
  data.title = 'Variation de la ponctualité'
  var [svg] = generateCandleGraph(container, data)
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to fetch
 */
export function generateBottomGraph (container, data) {
  // Generate common graph
  data.title = 'Achalandage Moyen'
  var [svg] = generateBarGraph(container, data)
}

/**
 * @param {Selection} container The div to generate the graph in
 * @param {object} data The data to display
 * @returns {Selection} The generated graph as svg
 */
 export function generateCandleGraph (container, data) {
  // ===================== SETUP =====================
  
  // Delete existing content
  container.html('')
  // Set size
  var width = container.node().getBoundingClientRect().width
  var height = container.node().getBoundingClientRect().height
  // Create svg
	var margin = {top: 50, right: 100, bottom: 25, left: 100}
	var BAR_WIDTH = (width - margin.left - margin.right) / data.stops.length
  var svg = container.append('svg')
		.attr("width", width)
		.attr("height", height)

  // ===================== OTHER =====================

	// X axis
	var xScale = d3.scaleBand()
		.range([ margin.left, width - margin.right])
		.domain(data.stops)

	// Add Y axis
	var yScale = d3.scaleLinear()
		.domain([Math.min(...data.delay), Math.max(...data.delay)])
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
	.text('Minutes')
	.attr('fill', '#898989')
	.attr('font-size', 12)
	
	// Draw axis line 0 
	var xAxis = svg.append('g')
		.attr('id', 'x-axis')
  // Draw axis line
  xAxis.append('path')
    .attr('d', d3.line()([
      [margin.left, yScale(0)],
      [width - margin.left  , yScale(0)]
    ]))
    .attr('stroke', 'black')
		.style("stroke-dasharray","3,3")
		
	// Draw axis line 5 
	var xAxis = svg.append('g')
		.attr('id', 'x-axis')
  // Draw axis line
  xAxis.append('path')
    .attr('d', d3.line()([
      [margin.left, yScale(5)],
      [width - margin.left  , yScale(5)]
    ]))
    .attr('stroke', 'black')
		.style("stroke-dasharray","3,3")

	//Add right labels
	svg.append("text")
		.attr('x', width - margin.left + 10)
		.attr('y', (yScale(0.5*(Math.max(...data.delay)-5) + 5)))
		.text('Retard')
		.attr('fill', '#D7625D')
		.attr('font-size', 16)

	svg.append("text")
			.text('Ponctuel')
			.attr('x', width - margin.left + 10)
      .attr('y', (yScale(2.5)))
      .attr('fill', '#577845')
			.attr('font-size', 16)

	svg.append("text")
		.attr('x', width - margin.left + 10)
		.attr('y', (yScale(0.5*(Math.min(...data.delay)))))
		.text('Avance')
		.attr('fill', '#FFD966')
		.attr('font-size', 16)

	// Bars
	var lines = svg.append('g')
	.attr('id', 'vertLine')
	var bars = svg.append('g')
	.attr('id', 'bars')
	var previousDelay = 0;
	var fillColor = BAR_FILL_COLOR_NEGATIVE
	var strockeColor = BAR_STROKE_COLOR_NEGATIVE
  for (let i = 0; i < data.delay.length; i++) {
    const x = xScale(data.stops[i])
    const y = yScale(data.delay[i])
		var height = 0;
		var yPos = y;
		if(data.delay[i] > previousDelay) {
			height = yScale(previousDelay) - y
			fillColor = BAR_FILL_COLOR_NEGATIVE
			strockeColor = BAR_STROKE_COLOR_NEGATIVE
		} else if (data.delay[i] < previousDelay) {
			yPos = yScale(previousDelay);
			height = -(yScale(previousDelay) - yScale(data.delay[i]))
			fillColor = BAR_FILL_COLOR_POSITIVE
			strockeColor = BAR_STROKE_COLOR_POSITIVE
		} else if ((data.delay[i] == previousDelay)) {
			height = 0.1;
		}
		lines.append("line")
		.attr("x1", x + (xScale.bandwidth()/2)) 
		.attr("x2", x + (xScale.bandwidth()/2))
		.attr("y1", yScale(-5))
		.attr("y2",	yScale(Math.max(...data.delay)))
		.attr('class', `stop${i} line`)
		.style("stroke-width", 2)
		.style("stroke", "black")
		.style("fill", "none")
		.style('visibility', 'hidden');

		bars.append('rect')
		.attr('x', x)
		.attr('width', xScale.bandwidth())
		.attr('height', height)
		.attr('y', yPos)
		.attr('fill', fillColor)
		.attr('stroke', strockeColor)
		.attr('stroke-width', BAR_STROKE_WIDTH)
		.attr('class', `stop${i}`)
		.on("mouseover", function(d) {
			d3.selectAll(`.stop${i}`).raise()
				.attr('stroke-width', BAR_STROKE_WIDTH * 2)
			d3.selectAll(`.stop${i}.line`)
				.style('visibility', 'visible')
			d3.selectAll(`.stop${i}.textValue`)
				.style('visibility', 'visible')
			d3.selectAll(`.axisText${i}`)
				.attr("font-weight", 1000)
		})
		.on("mouseout", function() {
			d3.selectAll(`.stop${i}`)
				.attr('stroke-width', BAR_STROKE_WIDTH)
			d3.selectAll(`.stop${i}.line`)
				.style('visibility', 'hidden')
			d3.selectAll(`.stop${i}.textValue`)
				.style('visibility', 'hidden')
			d3.selectAll(`.axisText${i}`)
				.attr("font-weight", 0)
		});
		bars.append("text")
			.text(`${data.delay[i]}`)
			.attr('x', x + xScale.bandwidth() + 5)
			.attr('y', y - 10)
			.attr('fill', 'black')
			.attr('class', `stop${i} textValue`)
			.attr('font-size', 16)
			.style('visibility', 'hidden')
		previousDelay = data.delay[i]
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
	var margin = {top: 50, right: 100, bottom: 200, left: 100}
  var svg = container.append('svg')
		.attr("width", width)
		.attr("height", height)

  // ===================== OTHER =====================

	// X axis
	var xScale = d3.scaleBand()
		.range([ margin.left, width - margin.right])
		.domain(data.stops)
	svg.append("g")
		.attr("transform", "translate(0," + (height-margin.bottom) + ")")
		.call(d3.axisBottom(xScale))
		.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.attr("class", function(d,i) {return "axisText" + i})
			.style("text-anchor", "end");

	//X Title
	svg.append("text")
		.attr("transform", "translate(" + (width-margin.right) + "," + (height-margin.bottom + 25) + ")")
		.text('Arrêt')
		.attr('fill', '#898989')
		.attr('font-size', 12)

	// Add Y axis
	var yScale = d3.scaleLinear()
		.domain([0, Math.max(...data.amounts)])
		.range([height - margin.bottom, margin.top]);
	svg.append("g")
		.attr("transform", "translate(" + margin.left + ", 0 )")
		.call(d3.axisLeft(yScale))

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
	
	// ===================== HOVER =====================

	// Bars
	var lines = svg.append('g')
	.attr('id', 'vertLine')
	var bars = svg.append('g')
	.attr('id', 'bars')
  for (let i = 0; i < data.amounts.length; i++) {
    const x = xScale(data.stops[i])
    const y = yScale(data.amounts[i])
		lines.append("line")
			.attr("x1", x + (xScale.bandwidth()/2)) 
			.attr("x2", x + (xScale.bandwidth()/2)) 
			.attr("y1", yScale(0))
			.attr("y2",	yScale(Math.max(...data.amounts)))
			.attr('class', `stop${i} line`)
			.style("stroke-width", 2)
			.style("stroke", "black")
			.style("fill", "none")
			.style('visibility', 'hidden');

    bars.append('rect')
			.attr('x', x)
			.attr('width', xScale.bandwidth())
      .attr('height', yScale(0) - y)
      .attr('y', y)
      .attr('fill', BAR_FILL_COLOR)
      .attr('stroke', BAR_STROKE_COLOR)
      .attr('stroke-width', BAR_STROKE_WIDTH)
			.attr('class', `stop${i}`)
			.on("mouseover", function(d) {
				d3.selectAll(`.stop${i}`).raise()
					.attr('stroke-width', BAR_STROKE_WIDTH * 2)
				d3.selectAll(`.stop${i}.line`)
					.style('visibility', 'visible')
				d3.selectAll(`.stop${i}.textValue`)
					.style('visibility', 'visible')
				d3.selectAll(`.axisText${i}`)
				.attr("font-weight", 1000)
			})
			.on("mouseout", function() {
				d3.selectAll(`.stop${i}`)
					.attr('stroke-width', BAR_STROKE_WIDTH)
				d3.selectAll(`.stop${i}.line`)
					.style('visibility', 'hidden')
				d3.selectAll(`.stop${i}.textValue`)
					.style('visibility', 'hidden')
				d3.selectAll(`.axisText${i}`)
					.attr("font-weight", 0)
			});
		bars.append("text")
			.text(`${data.amounts[i]}`)
			.attr('x', x + xScale.bandwidth() + 5)
			.attr('y', y -10)
			.attr('fill', 'black')
			.attr('class', `stop${i} textValue`)
			.attr('font-size', 16)
			.style('visibility', 'hidden')
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