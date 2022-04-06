// INF8808 - TP5
// Groupe 4
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//

import d3Legend from 'd3-svg-legend'

/**
 * Draws the color legend.
 *
 * @param {*} colorScale The color scale used for the legend
 * @param {*} g The d3 Selection of the SVG g elemnt containing the legend
 */
export function drawLegend (colorScale, g) {
  // TODO : Generate the legend
  // For help, see : https://d3-legend.susielu.com/
  g.append('g')
  .attr('class', 'legend')
  .attr('transform', 'translate(50, 130)')
  .style('font-size', '15')

  const legend = d3Legend.legendColor()
  .shape('path', d3.symbol().type(d3.symbolCircle).size(300)())
  .title('Légende')
  .scale(colorScale)

  g.select('.legend')
    .call(legend)
}
