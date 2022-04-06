// INF8808 - Exo
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//

/**
 *  Uses the projection to convert longitude and latitude to xy coordinates.
 *
 * The keys for the coordinate are written to each feature object in the data.
 *
 * @param {object[]} data The data to be displayed
 * @param {*} projection The projection to use to convert the longitude and latitude
 */
export function convertCoordinates (data, projection) {
  for (const element of data.features) {
    var xy = projection(element.geometry.coordinates)
    element.x = xy[0]
    element.y = xy[1]
  }
}

/**
 * Simplifies the titles for the property 'TYPE_SITE_INTERVENTION'. The names
 * to use are contained in the constant 'TITLES' above.
 *
 * @param {*} data The data to be displayed
 */
export function simplifyDisplayTitles (data) {
  for (const element of data.features) {
    element.properties.TYPE_SITE_INTERVENTION = TITLES[element.properties.TYPE_SITE_INTERVENTION]
  }
}
