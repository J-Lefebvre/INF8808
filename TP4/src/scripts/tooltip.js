// INF8808 - TP4
// Groupe 4
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//
/**
 * Defines the contents of the tooltip. See CSS for tooltip styling. The tooltip
 * features the country name, population, GDP, and CO2 emissions, preceded
 * by a label and followed by units where applicable.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  // TODO : Generate tooltip contents
  var Country = d["Country Name"]
  var Population = d["Population"]
  var GDP = d["GDP"].toFixed(2)
  var CO2 = d["CO2"].toFixed(2)
  return '<span>Country : <span class=tooltip-value>'+Country+'</span></span>'+
  '<br><span>Population : <span class=tooltip-value>'+Population+'</span></span>'+
  '<br><span>GDP : <span class=tooltip-value>'+GDP+' $ (USD)</span></span>'+
  '<br><span>CO2 emissions : <span class=tooltip-value>'+CO2+' metric tonnes</span></span>'
}
