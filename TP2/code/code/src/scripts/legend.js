/**
 * Draws a legend in the area at the bottom of the screen, corresponding to the bars' colors
 *
 * @param {string[]} data The data to be used to draw the legend elements
 * @param {*} color The color scale used throughout the visualisation
 */
export function draw (data, color) {
  // TODO : Generate the legend in the div with class "legend". Each SVG rectangle
  // should have a width and height set to 15.
  // Tip : Append one div per legend element using class "legend-element".

  data.forEach(player => {
    const legendElement = d3.select('.legend')
      .append('div')
      .attr('class', 'legend-element')

    legendElement.append('svg')
      .attr('width', 20)
      .attr('height', 20)
      .append('rect')
      .attr('fill', color(player))
      .attr('width', 15)
      .attr('height', 15)

    legendElement.append('text')
      .text(player)
  })
}
