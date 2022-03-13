// INF8808 - TP4
// Groupe 4
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//

import d3Legend from 'd3-svg-legend'

/**
 * Draws the legend.
 *
 * @param {*} colorScale The color scale to use
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {number} width The width of the graph, used to place the legend
 */
export function drawLegend (colorScale, g, width) {
  // TODO : Draw the legend using d3Legend
  // For help, see : https://d3-legend.susielu.com/
  g.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + width + ', -20)')
  
  var legendComponent = d3Legend.legendColor()
  .shape("path", d3.symbol().type(d3.symbolCircle).size(300)())
  .title("Legend")
  .scale(colorScale);

  g.select('.legend')
  .call(legendComponent)
  .style("font-size","12px");
}
