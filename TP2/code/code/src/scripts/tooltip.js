/**
 * Defines the contents of the tooltip.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  /* TODO : Define and return the tooltip contents including :
      + A title stating the hovered element's group, with:
        - Font family: Grenze Gotish
        - Font size: 24px
        - Font weigth: normal
      + A bold label for the player name followed
        by the hovered elements's player's name
      + A bold label for the player's line count
        followed by the number of lines
  */
  const toolTipElement = d3.create()
  toolTipElement.append('div')
    .append('p')
    .attr('id', 'tooltip-title')
    .text('Act ' + d.Act)

  toolTipElement.append('div')
    .append('label')
    .append('b')
    .text('Player : ')
    .append('text')
    .attr('class', 'tooltip-value')
    .text(d.Player.Player)

  toolTipElement.append('div')
    .append('label')
    .append('b')
    .text('Count : ')
    .append('text')
    .attr('class', 'tooltip-value')
    .text(d.Player.Count)

  return toolTipElement.html()
}
