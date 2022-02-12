// INF8808 - TP3
// Groupe 4
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//
/**
 * Sets up an event handler for when the mouse enters and leaves the squares
 * in the heatmap. When the square is hovered, it enters the "selected" state.
 *
 * The tick labels for the year and neighborhood corresponding to the square appear
 * in bold.
 *
 * @param {*} xScale The xScale to be used when placing the text in the square
 * @param {*} yScale The yScale to be used when placing the text in the square
 * @param {Function} rectSelected The function to call to set the mode to "selected" on the square
 * @param {Function} rectUnselected The function to call to remove "selected" mode from the square
 * @param {Function} selectTicks The function to call to set the mode to "selected" on the ticks
 * @param {Function} unselectTicks The function to call to remove "selected" mode from the ticks
 */
export function setRectHandler (xScale, yScale, rectSelected, rectUnselected, selectTicks, unselectTicks) {
  // TODO : Select the squares and set their event handlers

  d3.selectAll('#graph-g .data-square')
    // Set handler for entering element
    .on('mouseover', function () { 
      rectSelected(this, xScale, yScale)
      var data = d3.select(this).datum()
      selectTicks(data.Arrond_Nom, data.Plantation_Year)
    })
    // Set handler for leaving element
    .on('mouseout', function () {
      rectUnselected(this)
      unselectTicks()
    })
}

/**
 * The function to be called when one or many rectangles are in "selected" state,
 * meaning they are being hovered
 *
 * The text representing the number of trees associated to the rectangle
 * is displayed in the center of the rectangle and their opacity is lowered to 75%.
 *
 * @param {*} element The selection of rectangles in "selected" state
 * @param {*} xScale The xScale to be used when placing the text in the square
 * @param {*} yScale The yScale to be used when placing the text in the square
 */
export function rectSelected (element, xScale, yScale) {
  // TODO : Display the number of trees on the selected element
  // Make sure the nimber is centered. If there are 1000 or more
  // trees, display the text in white so it contrasts with the background.

  // Lower opacity
  element.style.opacity = 0.75
  // Retrieve data
  var data = d3.select(element).datum() // d3?
  var dimension = d3.select(element).node().getBBox()
  // Display tree count
  d3.select(element).append("text")
    // Position text
    .attr('x', xScale(data.Plantation_Year) + dimension.width / 2)
    .attr('y', yScale(data.Arrond_Nom) + dimension.height / 2 + 5)
    .attr('text-anchor', 'middle')
    // Preven text from retriggering mouse events
    .attr('pointer-events', 'none')
    // Style text
    .style('font-size', '12')
    .style('font-family', 'Roboto')
    .style('fill', (data.Counts < 1000 ? 'black' : 'white'))
    .text(data.Counts)
}

/**
 * The function to be called when the rectangle or group
 * of rectangles is no longer in "selected state".
 *
 * The text indicating the number of trees is removed and
 * the opacity returns to 100%.
 *
 * @param {*} element The selection of rectangles in "selected" state
 */
export function rectUnselected (element) {
  // TODO : Unselect the element

  // Set opacity back to default
  element.style.opacity = ''
  // Remove tree count
  d3.select(element).select("text").remove()
}

/**
 * Makes the font weight of the ticks texts with the given name and year bold.
 *
 * @param {string} name The name of the neighborhood associated with the tick text to make bold
 * @param {number} year The year associated with the tick text to make bold
 */
export function selectTicks (name, year) {
  // TODO : Make the ticks bold

  // Find matching labels
  var labels = d3.selectAll("g.axis text")._groups[0]
  labels.forEach(element => {
    if (element.__data__ === name || element.__data__ === year) {
      // Make labels bold
      element.style.fontWeight = 'bold'
    }
  })
}

/**
 * Returns the font weight of all ticks to normal.
 */
export function unselectTicks () {
  // TODO : Unselect the ticks

  // Get all labels
  var labels = d3.selectAll("g.axis text")._groups[0]
  labels.forEach(element => {
      // Set weight back to default
      element.style.fontWeight = ''
    }
  )
}
