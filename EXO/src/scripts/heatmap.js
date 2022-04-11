// Idée générale pour l'algorithme qui parcours l'objet vizData pour recueillir les valeurs pour chaque carré de la heatmap.

/**
 * @param vizData
 * @param ligne
 * @param girouette
 * @param indicateur
 */
export function drawHeatmap (vizData, ligne, girouette, indicateur) {
  var posLigne = vizData.findIndex(e => e.ligne === ligne)
  var posGirouette = vizData[posLigne].girouettes.findIndex(e => e.girouette === girouette)

  for (var v = 0; v < vizData[posLigne].girouettes[posGirouette].voyages.length; v++) {
    for (var a = 0; a < vizData[posLigne].girouettes[posGirouette].voyages[v].arrets.length; a++) {
      var valueSquare = vizData[posLigne].girouettes[posGirouette].voyages[v].arrets[a][indicateur]
      //console.log(valueSquare)
    }
  }
}
