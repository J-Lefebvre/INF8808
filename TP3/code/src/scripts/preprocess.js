// INF8808 - TP3
// Groupe 4
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//
/**
 * Gets the names of the neighborhoods.
 *
 * @param {object[]} data The data to analyze
 * @returns {string[]} The names of the neighorhoods in the data set
 */
export function getNeighborhoodNames (data) {
  // TODO: Return the neihborhood names
  var neighborhoodNames = new Set()
  data.forEach(element => {
    neighborhoodNames.add(element.Arrond_Nom)
  });
  return neighborhoodNames
}

/**
 * Filters the data by the given years.
 *
 * @param {object[]} data The data to filter
 * @param {number} start The start year (inclusive)
 * @param {number} end The end year (inclusive)
 * @returns {object[]} The filtered data
 */
export function filterYears (data, start, end) {
  // TODO : Filter the data by years
  return data.filter(element => {
      var elementYear = (element.Date_Plantation).getFullYear()
      if(start <= elementYear && end >= elementYear) {
        return elementYear
      }
  });
}

/**
 * Summarizes how many trees were planted each year in each neighborhood.
 *
 * @param {object[]} data The data set to use
 * @returns {object[]} A table of objects with keys 'Arrond_Nom', 'Plantation_Year' and 'Counts', containing
 * the name of the neighborhood, the year and the number of trees that were planted
 */
export function summarizeYearlyCounts (data) {
  // TODO : Construct the required data table
  const dataMap = new Map()

  data.forEach(element => {
    var neighborhoodName = element.Arrond_Nom
    var plantationYear = element.Date_Plantation.getFullYear()
    var currentKey = neighborhoodName + plantationYear
    var currentCount = 0
    if(dataMap.get(currentKey)){
      currentCount = dataMap.get(currentKey).Counts + 1
    } else {
      currentCount = 1
    }
    dataMap.set(currentKey, { Arrond_Nom: neighborhoodName, Plantation_Year: plantationYear, Counts: currentCount })
  });

  return Array.from(dataMap.values())
}

/**
 * For the heat map, fills empty values with zeros where a year is missing for a neighborhood because
 * no trees were planted or the data was not entered that year.
 *
 * @param {object[]} data The datas set to process
 * @param {string[]} neighborhoods The names of the neighborhoods
 * @param {number} start The start year (inclusive)
 * @param {number} end The end year (inclusive)
 * @param {Function} range A utilitary function that could be useful to get the range of years
 * @returns {object[]} The data set with a new object for missing year and neighborhood combinations,
 * where the values for 'Counts' is 0
 */
export function fillMissingData (data, neighborhoods, start, end, range) {
  // TODO : Find missing data and fill with 0
  neighborhoods.forEach(neighborhood => {
    range(start, end).forEach(year => {
      if(!(data.find(element => element.Arrond_Nom == neighborhood && element.Plantation_Year == year))){
        data.push({ Arrond_Nom: neighborhood, Plantation_Year: year, Counts: 0 })
      }
    })
  });
  return data
}
