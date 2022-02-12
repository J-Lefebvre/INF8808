// INF8808 - TP3
// Groupe 4
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//
import { max } from "d3";

/**
 * Sets the domain of the color scale
 *
 * @param {*} colorScale The color scale used in the heatmap
 * @param {object[]} data The data to be displayed
 */
export function setColorScaleDomain(colorScale, data) {
  // TODO : Set domain of color scale
  // get the max value to bind it to the domain
  // it is known the min  for Counts to be 0 (cf fillMissingData function)
  let maxDomain = 0;
  data.forEach(element => {
    if (element.Counts > maxDomain) {
      maxDomain = element.Counts;
    }
  })
  colorScale.domain([0, maxDomain])
}

/**
 * For each data element, appends a group 'g' to which an SVG rect is appended
 *
 * @param {object[]} data The data to use for binding
 */
export function appendRects(data) {
  // TODO : Append SVG rect elements
  // for every line of data, we create a <g class='#_year'> <rect> </rect> </g> structure
  // I chose to store the year in the class of g (will be used in the update)
  var graph = d3.select('#graph-g')
  data.forEach(element => {
    graph.append('g')
      .attr('class', 'data-square')
      .data([element])
      .append('rect')
  })
}

/**
 * Updates the domain and range of the scale for the x axis
 *
 * @param {*} xScale The scale for the x axis
 * @param {object[]} data The data to be used
 * @param {number} width The width of the diagram
 * @param {Function} range A utilitary funtion that could be useful to generate a list of numbers in a range
 */
export function updateXScale(xScale, data, width, range) {
  // TODO : Update X scale
  // we want to be able to change the chosen years in the preprocess so we manually search for the start and end year
  let minYear = Infinity
  let maxYear = 0
  data.forEach(element => {
    if (element.Plantation_Year < minYear) {
      minYear = element.Plantation_Year
    }
    if (element.Plantation_Year > maxYear) {
      maxYear = element.Plantation_Year
    }
  })
  xScale.domain(range(minYear, maxYear)).range([0, width])
}

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {string[]} neighborhoodNames The names of the neighborhoods
 * @param {number} height The height of the diagram
 */
export function updateYScale(yScale, neighborhoodNames, height) {
  // TODO : Update Y scale
  // Make sure to sort the neighborhood names alphabetically
  // neighborhoodNames is a Set so we cast it to an Array which we sort (default is alphabetical)
  yScale.domain([...neighborhoodNames].sort()).range([0, height])
}

/**
 *  Draws the X axis at the top of the diagram.
 *
 *  @param {*} xScale The scale to use to draw the axis
 */
export function drawXAxis(xScale) {
  // TODO : Draw X axis
  d3.select('.x.axis')
    .call(d3.axisTop(xScale));
}

/**
 * Draws the Y axis to the right of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 * @param {number} width The width of the graphic
 */
export function drawYAxis(yScale, width) {
  // TODO : Draw Y axis
  d3.select('.y.axis')
    .attr('transform', 'translate(' + width + ', 0)')
    .call(d3.axisRight(yScale))
}

/**
 * Rotates the ticks on the X axis 45 degrees towards the left.
 */
export function rotateXTicks() {
  // TODO : Rotate X axis' ticks
  d3.select('.x.axis').selectAll('g').selectAll('text')
    .attr('transform', 'rotate(-45)')
}

/**
 * After the rectangles have been appended, this function dictates
 * their position, size and fill color.
 *
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {*} colorScale The color scale used to set the rectangles' colors
 */
export function updateRects(xScale, yScale, colorScale) {
  // TODO : Set position, size and fill of rectangles according to bound data

  d3.select('#graph-g').selectAll("rect")
    .attr('x',d => xScale(d.Plantation_Year))
    .attr('y', d => yScale(d.Arrond_Nom))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', d => colorScale(d.Counts))
}
