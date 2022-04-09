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
 * aggregateData() remplit l'objet heatmapData à partir des données du csv (data)
 *
 * heatmapData a la forme suivante :
 *
 * [
    {
        "ligne": 9,
        "girouettes": [
            {
                "girouette": "Lafontaine Via Gare  Saint-Jérôme",
                "voyages": [
                    {
                        "voyage": 1,
                        "arrets": [
                            {
                                "codeArret": 82127,
                                "nomArret": "Station Montmorency",
                                "minutesEcart": [
                                    1,
                                    ...
                                ],
                                "moyMinutesEcart": null,
                                "nClients": [
                                    3,
                                    ...
                                ],
                                "moyNClients": null,
                                "ponctualite": [
                                    "Ponctuel",
                                    ...
                                ],
                                "tauxPonctualite": null,
                                "minutesEcartClient": [
                                    3,
                                    ...
                                ],
                                "moyMinutesEcartClient": null
                            },
                            ...
 *
 *
 * @param {*} data L'array d'objets qui contient les lignes du csv, modifié par preprocess.addDayType()
 * @param {*} startDate Date de début
 * @param {*} endDate Date de fin
 * @param {*} typeJour On considère semaine ou weekend
 * @param {*} ferie On considère les fériés si true
 * @returns heatmapData
 */
export function aggregateData (data, startDate, endDate, typeJour, ferie) {
  var heatmapData = []

  for (var i = 0; i < data.length; i++) {
    if (data[i].date >= startDate && data[i].date <= endDate && data[i].type_jour === typeJour && data[i].ferie === ferie) {
      if (heatmapData.length === 0) {
        heatmapData.push({ ligne: data[i].ligne, girouettes: [] })
      }

      // On ajoute la ligne si elle n'existe pas déjà dans heatmapData
      var posLigne = heatmapData.findIndex(e => e.ligne === data[i].ligne)
      if (posLigne === -1) {
        heatmapData.push({ ligne: data[i].ligne, girouettes: [] })
        posLigne = heatmapData.length - 1
      }

      // On ajoute la direction si elle n'existe pas déjà dans heatmapData
      var posGirouette = heatmapData[posLigne].girouettes.findIndex(e => e.girouette === data[i].Girouette)
      if (posGirouette === -1) {
        heatmapData[posLigne].girouettes.push({ girouette: data[i].Girouette, voyages: [] })
        posGirouette = heatmapData[posLigne].girouettes.length - 1
      }

      // On ajoute le voyage s'il n'existe pas déjà dans heatmapData
      var posVoyage = heatmapData[posLigne].girouettes[posGirouette].voyages.findIndex(e => e.voyage === data[i].voyage)
      if (posVoyage === -1) {
        heatmapData[posLigne].girouettes[posGirouette].voyages.push({ voyage: data[i].voyage, arrets: [] })
        posVoyage = heatmapData[posLigne].girouettes[posGirouette].voyages.length - 1
      }

      // On ajoute l'arrêt s'il n'existe pas déjà dans heatmapData
      var posArret = heatmapData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.findIndex(e => e.codeArret === data[i].arret_code)
      if (posArret === -1) {
        heatmapData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.push(
          {
            codeArret: data[i].arret_code,
            nomArret: data[i].arret_nom,
            minutesEcart: [],
            moyMinutesEcart: null,
            nClients: [],
            moyNClients: null,
            ponctualite: [],
            tauxPonctualite: null,
            minutesEcartClient: [],
            moyMinutesEcartClient: null
          })
        posArret = heatmapData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.length - 1
      }

      heatmapData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].minutesEcart.push(data[i].Minutes_ecart_planifie)
      heatmapData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].nClients.push(data[i].montants)
      heatmapData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].ponctualite.push(data[i].Etat_Ponctualite)
      heatmapData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].minutesEcartClient.push(data[i].Minutes_ecart_planifie * data[i].montants)
    }
  }

  console.log(heatmapData)

  return heatmapData
}
