/**
 * Positions the x axis label and y axis label.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 */
export function positionLabels (g, width, height) {
  g.selectAll('.x.axis-text')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height + 50) + ')')

  g.selectAll('.y.axis-text')
    .attr('transform', 'translate(-50,' + (height / 2) + ') rotate(-90)')
}

/**
 * Draws the circles on the graph.
 *
 * @param {object} data The data to bind to
 * @param {*} rScale The scale for the circles' radius
 * @param {*} colorScale The scale for the circles' color
 */
export function drawCircles (data, rScale, colorScale) {
  // TODO : Draw the bubble chart's circles
  // Each circle's size depends on its population
  // and each circle's color depends on its continent.
  // The fill opacity of each circle is 70%
  // The outline of the circles is white
  var graph = d3.select('#graph-g')
  graph.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', country => rScale(country.Population))
    .style('fill', country => colorScale(country.Continent))
    .style('opacity', '70%')
    .style('stroke', 'white')
}

/**
 * Sets up the hover event handler. The tooltip should show on on hover.
 *
 * @param {*} tip The tooltip
 */
export function setCircleHoverHandler (tip) {
  // TODO : Set hover handler. The tooltip shows on
  // hover and the opacity goes up to 100% (from 70%)
  var graph = d3.select('#graph-g')
  graph.selectAll('circle')
  // Set handler for entering element
    .on('mouseover', (country, index, circles) => { 
      tip.show(country, circles[index])
      d3.select(circles[index]).style('opacity', '100%')
    })
    // Set handler for leaving element
    .on('mouseout', (country, index, circles) => {
      tip.hide(country, circles[index])
      d3.select(circles[index]).style('opacity', '70%')
    })
}

/**
 * Updates the position of the circles based on their bound data. The position
 * transitions gradually.
 *
 * @param {*} xScale The x scale used to position the circles
 * @param {*} yScale The y scale used to position the circles
 * @param {number} transitionDuration The duration of the transition
 */
export function moveCircles (xScale, yScale, transitionDuration) {
  // TODO : Set up the transition and place the circle centers
  // in x and y according to their GDP and CO2 respectively
  const graph = d3.select('#graph-g')
  graph.selectAll('circle')
    .transition()
    .duration(transitionDuration)
    .attr('cx', d => xScale(d.GDP))
    .attr('cy', d => yScale(d.CO2))
}

/**
 * Update the title of the graph.
 *
 * @param {number} year The currently displayed year
 */
export function setTitleText (year) {
  // TODO : Set the title
  var graph = d3.select('#graph-g')
  graph.selectAll('.title').text('Data for the year : ' + year)
}
