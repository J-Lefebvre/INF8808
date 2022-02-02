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
export function setColorScaleDomain (colorScale, data) {
  // TODO : Set domain of color scale
  // get the max value to bind it to the domain
  // it is known the min value to be 0
  let maxDomain = 0;
  data.forEach(element => {
    if(element.Comptes > maxDomain){
      maxDomain = element.Counts;
    }
  })
  colorScale.domain([0,maxDomain])
}

/**
 * For each data element, appends a group 'g' to which an SVG rect is appended
 *
 * @param {object[]} data The data to use for binding
 */
export function appendRects (data) {
  // TODO : Append SVG rect elements
  var graph = d3.select('#graph-g')
  data.forEach(element =>{
    graph.append("g")
      .append("svg")
      .append("rect")
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
export function updateXScale (xScale, data, width, range) {
  // TODO : Update X scale
  let minYear = Infinity
  let maxYear = 0
  data.forEach(element => {
    if(element.Plantation_Year<minYear){
      minYear=element.Plantation_Year
    }
    if(element.Plantation_Year>maxYear){
      maxYear=element.Plantation_Year
    }
  })
  xScale.domain(range(minYear,maxYear)).range([0, width])
}

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {string[]} neighborhoodNames The names of the neighborhoods
 * @param {number} height The height of the diagram
 */
export function updateYScale (yScale, neighborhoodNames, height) {
  // TODO : Update Y scale
  // Make sure to sort the neighborhood names alphabetically
  neighborhoodNames.sort()
  // neighborhoodNames.reverse()
  yScale.domain(neighborhoodNames).range([0, height])
}

/**
 *  Draws the X axis at the top of the diagram.
 *
 *  @param {*} xScale The scale to use to draw the axis
 */
export function drawXAxis (xScale) {
  // TODO : Draw X axis
  let x_axis = d3.select('.x.axis')
  let x_axis_scale = d3.axisTop().scale(xScale);

  x_axis.call(x_axis_scale);
}

/**
 * Draws the Y axis to the right of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 * @param {number} width The width of the graphic
 */
export function drawYAxis (yScale, width) {
  // TODO : Draw Y axis
}

/**
 * Rotates the ticks on the X axis 45 degrees towards the left.
 */
export function rotateXTicks () {
  // TODO : Rotate X axis' ticks
}

/**
 * After the rectangles have been appended, this function dictates
 * their position, size and fill color.
 *
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {*} colorScale The color scale used to set the rectangles' colors
 */
export function updateRects (xScale, yScale, colorScale) {
  // TODO : Set position, size and fill of rectangles according to bound data
}
