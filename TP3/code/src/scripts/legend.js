// INF8808 - TP3
// Groupe 4
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//

/**
 * Initializes the definition for the gradient to use with the
 * given colorScale.
 *
 * @param {*} colorScale The color scale to use
 */
export function initGradient (colorScale) {
  const svg = d3.select('.heatmap-svg')

  const defs = svg.append('defs')

  const linearGradient = defs
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', 0).attr('y1', 1).attr('x2', 0).attr('y2', 0)

  linearGradient.selectAll('stop')
    .data(colorScale.ticks().map((tick, i, nodes) => (
      {
        offset: `${100 * (i / nodes.length)}%`,
        color: colorScale(tick)
      })))
    .join('stop')
    .attr('offset', d => d.offset)
    .attr('stop-color', d => d.color)
}

/**
 * Initializes the SVG rectangle for the legend.
 */
export function initLegendBar () {
  const svg = d3.select('.heatmap-svg')
  svg.append('rect').attr('class', 'legend bar')
}

/**
 *  Initializes the group for the legend's axis.
 */
export function initLegendAxis () {
  const svg = d3.select('.heatmap-svg')
  svg
    .append('g')
    .attr('class', 'legend axis')
}

/**
 * Draws the legend to the left of the graphic.
 *
 * @param {number} x The x position of the legend
 * @param {number} y The y position of the legend
 * @param {number} height The height of the legend
 * @param {number} width The width of the legend
 * @param {string} fill The fill of the legend
 * @param {*} colorScale The color scale represented by the legend
 */
export function draw (x, y, height, width, fill, colorScale) {
  // TODO : Draw the legend

  // Fill in legend's color bar
  d3.select('.legend.bar')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .style('fill', fill)

  // Move scale to correct position
  var legendAxis = d3.select('.legend.axis')
  legendAxis.attr('transform', 'translate(' + x + ',' + y + ')')

  // Create scale
  var scale  = d3.scaleLinear()
    .domain(colorScale.domain())
    .range([height, 0])

  // Apply & display scale
  var nTicks = 7
  var axis = d3.axisLeft(scale).ticks(nTicks)
  legendAxis.call(axis)
}   
