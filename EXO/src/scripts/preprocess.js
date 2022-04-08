// INF8808 - Exo
//
// Adam Prévost - 1947205
// Armelle Jézéquel - 2098157
// Clara Serruau - 2164678
// Jules Lefebvre - 1847158
// Julien Dupuis - 1960997
//

/**
 * Ajout de champs à l'objet
 * jour_semaine {0, 1, 2, 3, 4, 5, 6} où 0 = Dimanche
 * type_jour {semaine, fin de semaine}
 * ferie {true, false}
 *
 * @param {object[]} data L'array d'objets qui contient les lignes du csv
 */
export function addDayType (data) {
  for (var i = 0; i < data.length; i++) {
    // jour_semaine
    data[i].jour_semaine = data[i].date.getDay()

    // type_jour
    data[i].jour_semaine === (0 || 6) ? data[i].type_jour = 'fin de semaine' : data[i].type_jour = 'semaine'

    // ferie
    isNaN(data[i].voyage) ? data[i].ferie = true : data[i].ferie = false
  }
}
/**
 * TODO : Définition
 *
 * @param {*} data L'array d'objets qui contient les lignes du csv, modifié par preprocess.addDayType()
 * @param {*} startDate Date de début
 * @param {*} endDate Date de fin
 * @param {*} typeJour On considère semaine ou weekend
 * @param {*} ferie On considère les fériés si true
 * @returns heatmapData
 */
export function aggregateData (data, startDate, endDate, typeJour, ferie) {
  var heatmapData = {
    ligne: {
      girouette: {
        noVoyage: {
          arret: {
            minutesEcart: [],
            nClients: [],
            ponctualite: [],
            minutesEcartClient: []
          }
        }
      }
    }
  }

  for (var i = 0; i < data.length; i++) {
    console.log(data[i])
    if (data[i].date >= startDate && data[i].date <= endDate && data[i].type_jour === typeJour && data[i].ferie === ferie) {
      var ligne = data[i].ligne
      var girouette = data[i].Girouette
      var noVoyage = data[i].noVoyage
      var arret = data[i].arret

      heatmapData[ligne][girouette][noVoyage][arret].minutesEcart.push(data[i].Minutes_ecart_planifie)
      heatmapData[ligne][girouette][noVoyage][arret].nClients.push(data[i].montants)
      heatmapData[ligne][girouette][noVoyage][arret].ponctualite.push(data[i].Etat_Ponctualite)
      heatmapData[ligne][girouette][noVoyage][arret].minutesEcartClient.push(data[i].Minutes_ecart_planifie * data[i].montants)
    }
  }

  console.log(heatmapData)

  return heatmapData
}
