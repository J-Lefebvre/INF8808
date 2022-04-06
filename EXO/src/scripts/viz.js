// INF8808 - TP5
// Groupe 4
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//
import * as helper from './helper.js'
/**
 * Sets the domain of the color scale. Each type of site should have its own corresponding color.
 *
 * @param {*} color The color scale to be used
 * @param {object[]} data The data to be displayed
 */
export function colorDomain (color, data) {
  // Set the color domain
  let Domain = [];
  for (const element of data.features) {
    if(!(Domain.includes(element.properties.TYPE_SITE_INTERVENTION))){
      Domain.push(element.properties.TYPE_SITE_INTERVENTION)
    }
  }
  color.domain(Domain.sort())
}

/**
 * Draws the map base of Montreal. Each neighborhood should display its name when hovered.
 *
 * @param {object[]} data The data for the map base
 * @param {*} path The path associated with the current projection
 * @param {Function} showMapLabel The function to call when a neighborhood is hovered
 */
export function mapBackground (data, path, showMapLabel) {
  // TODO : Generate the map background and set the hover
  d3.select('#map-g')
	.selectAll("path")
	// Here, "features" is the GeoJSON snippet that we saw earlier
	.data(data.features)
	.enter()
	.append("path")
	.attr("d", (feature) => path(feature))
  .attr("fill","#cdd1c4")
  .attr("stroke","#ffffff")
  .on("mouseover",(feature)=>showMapLabel(feature,path))
  .on("mouseout",(feature)=>d3.select("."+feature.properties.NOM.split("-")[0].split(" ")[0].split("'")[0]).remove());
}

/**
 * When a neighborhood is hovered, displays its name. The center of its
 * name is positioned at the centroid of the shape representing the neighborhood
 * on the map. Called when the neighborhood is hovered.
 *
 * @param {object[]} d The data to be displayed
 * @param {*} path The path used to draw the map elements
 */
export function showMapLabel (d, path) {
  // TODO : Show the map label at the center of the neighborhood
  // by calculating the centroid for its polygon
 
  let coord = path.centroid(d.geometry);
  var tooltip = d3.select("#map-g")
    .append("text")
    .attr("class",d.properties.NOM.split("-")[0].split(" ")[0].split("'")[0])
    .attr("transform","translate("+(coord[0])+","+(coord[1])+")")
    .style('font-size', '12')
    .style('font-family', 'Roboto')
    .attr('text-anchor', 'middle')
    .text(d.properties.NOM);

    return tooltip

}

/**
 * Displays the markers for each street on the map.
 *
 * @param {object[]} data The street data to be displayed
 * @param {*} color The color scaled used to determine the color of the circles
 * @param {*} panel The display panel, which should be dislayed when a circle is clicked
 */
export function mapMarkers (data, color, panel) {
  // TODO : Display the map markers.
  // Their color corresponds to the type of site and their outline is white.
  // Their radius is 5 and goes up to 6 while hovered by the cursor.
  // When clicked, the panel is displayed.

  let map = d3.select('#marker-g')
  let simulation = helper.getSimulation(data.features);
  helper.simulate(simulation);
  map.selectAll('circle')
    .data(data.features)
    .enter()
    .append('circle')
    .attr("class","marker")
    .attr('cx',(properties)=>properties.x)
    .attr('cy',(properties)=>properties.y)
    .attr('r',5)
    .attr("stroke","#ffffff")
    .attr("fill",(properties)=>color(properties.properties.TYPE_SITE_INTERVENTION))
    .on('mouseover',function (d) {
      d3.select(this).attr('r',6)
    })
    .on('mouseout',function (d) {
      d3.select(this).attr('r',5)})
    .on("click",(properties)=>panel.display(properties.properties,color))
    
}
