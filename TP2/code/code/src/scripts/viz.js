
/**
 * Sets the domain and range of the X scale.
 *
 * @param {*} scale The x scale
 * @param {object[]} data The data to be used
 * @param {number} width The width of the graph
 */
export function updateGroupXScale (scale, data, width) {
  // TODO : Set the domain and range of the groups' x scale
  var domain = []
  for (const act of data) {
    domain.push(act.Act)
  }
  scale.domain(domain).range([0, width])
}

/**
 * Sets the domain and range of the Y scale.
 *
 * @param {*} scale The Y scale
 * @param {object[]} data The data to be used
 * @param {number} height The height of the graph
 */
export function updateYScale (scale, data, height) {
  // TODO : Set the domain and range of the graph's y scale
  var maxLineCount = 0
  for (const act of data) {
    for (const player of act.Players) {
      if (player.Count > maxLineCount) {
        maxLineCount = player.Count
      }
    }
  }
  scale.domain([maxLineCount, 0]).range([0, height])
}

/**
 * Creates the groups for the grouped bar chart and appends them to the graph.
 * Each group corresponds to an act.
 *
 * @param {object[]} data The data to be used
 * @param {*} x The graph's x scale
 */
export function createGroups (data, x) {
  // TODO : Create the groups
  d3.selectAll('g.bar-group').remove()
  var graph = d3.select('#graph-g')
  // for each act
  for (const [i, act] of data.entries()) {
    var xOffset = x(act.Act)
    // create a group
    graph.append('g')
      .attr('transform', 'translate(' + xOffset + ',' + 0 + ')')
      .attr('class', 'bar-group')
      // bind data to group for later use
      .data([data[i]])
  }
}

/**
 * Draws the bars inside the groups
 *
 * @param {*} y The graph's y scale
 * @param {*} xSubgroup The x scale to use to position the rectangles in the groups
 * @param {string[]} players The names of the players, each corresponding to a bar in each group
 * @param {number} height The height of the graph
 * @param {*} color The color scale for the bars
 * @param {*} tip The tooltip to show when each bar is hovered and hide when it's not
 */
export function drawBars (y, xSubgroup, players, height, color, tip) {
  // TODO : Draw the bars
  d3.selectAll('g.bar-group')
    // for each group
    .each(function (d) {
      var barWidth = xSubgroup.range()[1] / players.length
      var groupData = d3.select(this).datum()
      // for each player
      for (const [i, player] of players.entries()) {
        var playerObj = groupData.Players.find(x => x.Player === player)
        // if player is in group
        if (playerObj) {
          var barHeight = playerObj.Count / y.domain()[0] * y.range()[1]
          // add the bar
          d3.select(this).append('rect')
            .attr('x', barWidth * i)
            .attr('y', height - barHeight)
            .attr('width', barWidth)
            .attr('height', barHeight)
            .attr('fill', color(i))
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .data([{ Act: groupData.Act, Player: playerObj }])
        }
      }
    })
}
