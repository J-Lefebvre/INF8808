/**
 * Defines the scale to use for the circle markers' radius.
 *
 * The radius of the circle is linearly proportional to the population of the given country.
 *
 * The radius is a value defined in the interval [5, 20].
 *
 * @param {object} data The data to be displayed
 * @returns {*} The linear scale used to determine the radius
 */
export function setRadiusScale (data) {
  let maxPopulation = 0
  for (const year in data) {
    for (const country of data[year]) {
      if (country.Population > maxPopulation) {
        maxPopulation = country.Population
      }
    }
  }
  return d3.scaleLinear()
    .domain([0, maxPopulation])
    .range([5, 20])
}

/**
 * Defines the color scale used to determine the color of the circle markers.
 *
 * The color of each circle is determined based on the continent of the country it represents.
 *
 * The possible colors are determined by the scheme d3.schemeCategory10.
 *
 * @param {object} data The data to be displayed
 * @returns {*} The ordinal scale used to determine the color
 */
export function setColorScale (data) {
  return d3.scaleOrdinal()
    .domain([0, 5]) // TODO : compter les continents
    .range(d3.schemeCategory10)
}

/**
 * Defines the log scale used to position the center of the circles in X.
 *
 * @param {number} width The width of the graph
 * @param {object} data The data to be used
 * @returns {*} The log scale in X
 */
export function setXScale (width, data) {
  let maxGDP = 0
  for (const year in data) {
    for (const country of data[year]) {
      if (country.GDP > maxGDP) {
        maxGDP = country.GDP
      }
    }
  }
  return d3.scaleLog()
    .domain([0, maxGDP])
    .range([0, width])
}

/**
 * Defines the log scale used to position the center of the circles in Y.
 *
 * @param {number} height The height of the graph
 * @param {object} data The data to be used
 * @returns {*} The log scale in Y
 */
export function setYScale (height, data) {
  let maxCO2 = 0
  for (const year in data) {
    for (const country of data[year]) {
      if (country.CO2 > maxCO2) {
        maxCO2 = country.CO2
      }
    }
  }
  return d3.scaleLog()
    .domain([maxCO2, 0])
    .range([height, 0])
}
