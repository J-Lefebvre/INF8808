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
 * aggregateData() remplit l'objet vizData à partir des données du csv (data)
 *
 * @param {*} csvData L'array d'objets qui contient les lignes du csv, modifié par preprocess.addDayType()
 * @param {*} vizData L'array d'objets qui contient les données consolidées requises pour générer les viz
 * @param {*} startDate Date de début
 * @param {*} endDate Date de fin
 * @param {*} typeJour On considère semaine ou weekend
 * @param {*} ferie On considère les fériés si true
 */
export function aggregateData (csvData, vizData, startDate, endDate, typeJour, ferie) {
  // Boucle sur les lignes de csvData pour remplir la structure vizData
  for (var i = 0; i < csvData.length; i++) {
    if (csvData[i].date >= startDate && csvData[i].date <= endDate && csvData[i].type_jour === typeJour && csvData[i].ferie === ferie) {
      if (vizData.length === 0) {
        vizData.push({ ligne: csvData[i].ligne, girouettes: [] })
      }

      // On ajoute la ligne si elle n'existe pas déjà dans vizData
      var posLigne = vizData.findIndex(e => e.ligne === csvData[i].ligne)
      if (posLigne === -1) {
        vizData.push({ ligne: csvData[i].ligne, girouettes: [] })
        posLigne = vizData.length - 1
      }

      // On ajoute la girouette si elle n'existe pas déjà dans vizData
      var posGirouette = vizData[posLigne].girouettes.findIndex(e => e.girouette === csvData[i].Girouette)
      if (posGirouette === -1) {
        vizData[posLigne].girouettes.push({ girouette: csvData[i].Girouette, voyages: [] })
        posGirouette = vizData[posLigne].girouettes.length - 1
      }

      // On ajoute le voyage s'il n'existe pas déjà dans vizData
      var posVoyage = vizData[posLigne].girouettes[posGirouette].voyages.findIndex(e => e.voyage === csvData[i].voyage)
      if (posVoyage === -1) {
        vizData[posLigne].girouettes[posGirouette].voyages.push({ voyage: csvData[i].voyage, arrets: [] })
        posVoyage = vizData[posLigne].girouettes[posGirouette].voyages.length - 1
      }

      // On ajoute l'arrêt s'il n'existe pas déjà dans vizData
      var posArret = vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.findIndex(e => e.codeArret === csvData[i].arret_code)
      if (posArret === -1) {
        vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.push(
          {
            codeArret: csvData[i].arret_code,
            nomArret: csvData[i].arret_nom,
            sequenceArret: csvData[i].sequence_arret,
            minutesEcart: new Map(),
            moyMinutesEcart: null,
            nClients: new Map(),
            moyNClients: null,
            ponctualite: new Map(),
            tauxPonctualite: null,
            minutesEcartClient: new Map(),
            moyMinutesEcartClient: null
          })
        posArret = vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.length - 1
      }

      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].minutesEcart.set(csvData[i].date, csvData[i].Minutes_ecart_planifie)
      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].nClients.set(csvData[i].date, csvData[i].montants)
      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].ponctualite.set(csvData[i].date, csvData[i].Etat_Ponctualite)
      vizData[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets[posArret].minutesEcartClient.set(csvData[i].date, csvData[i].Minutes_ecart_planifie * csvData[i].montants)
    }
  }

  // Parcours de vizData pour calculer les indicateurs pour chaque ligne.arret
  vizData.forEach(function (ligne) {
    ligne.girouettes.forEach(function (girouette) {
      girouette.voyages.forEach(function (voyage) {
        voyage.arrets.forEach(function (arret) {
          var sumMinutesEcart = 0
          arret.minutesEcart.forEach(v => { sumMinutesEcart += v })
          arret.moyMinutesEcart = sumMinutesEcart / arret.minutesEcart.size

          var sumNClients = 0
          arret.nClients.forEach(v => { sumNClients += v })
          arret.moyNClients = sumNClients / arret.nClients.size

          var sumMinutesEcartClient = 0
          arret.minutesEcartClient.forEach(v => { sumMinutesEcartClient += v })
          arret.moyMinutesEcartClient = sumMinutesEcartClient / arret.minutesEcartClient.size

          var countPonctuel = 0
          arret.ponctualite.forEach(v => { if (v === 'Ponctuel') { countPonctuel++ } })
          arret.tauxPonctualite = countPonctuel / arret.ponctualite.size
        })
      })
    })
  })
}

/**
 * aggregateDataForViz3() remplit l'objet vizData à partir des données du csv (data)
 *
 * @param {*} csvData L'array d'objets qui contient les lignes du csv, modifié par preprocess.addDayType()
 * @param {*} vizData L'array d'objets qui contient les données consolidées requises pour générer les viz
 * @param {*} startDate Date de début
 * @param {*} endDate Date de fin
 * @param {*} typeJour On considère semaine ou weekend
 * @param {*} ferie On considère les fériés si true
 */
export function aggregateDataForViz3 (csvData, vizData, startDate, endDate, typeJour, ferie) {
  // Boucle sur les lignes de csvData pour remplir la structure vizData
  for (var i = 0; i < csvData.length; i++) {
    if (csvData[i].date >= startDate && csvData[i].date <= endDate && csvData[i].type_jour === typeJour && csvData[i].ferie === ferie) {
      if (vizData.length === 0) {
        vizData.push({ date: csvData[i].date, lignes: [] })
      }

      // On ajoute la date si elle n'existe pas déjà dans vizData
      var posDate = vizData.findIndex(e => e.date.valueOf() === csvData[i].date.valueOf())
      if (posDate === -1) {
        vizData.push({ date: csvData[i].date, lignes: [] })
        posDate = vizData.length - 1
      }

      // On ajoute la ligne si elle n'existe pas déjà dans vizData
      var posLigne = vizData[posDate].lignes.findIndex(e => e.ligne === csvData[i].ligne)
      if (posLigne === -1) {
        vizData[posDate].lignes.push({ ligne: csvData[i].ligne, girouettes: [] })
        posLigne = vizData[posDate].lignes.length - 1
      }

      // On ajoute la girouette si elle n'existe pas déjà dans vizData
      var posGirouette = vizData[posDate].lignes[posLigne].girouettes.findIndex(e => e.girouette === csvData[i].Girouette)
      if (posGirouette === -1) {
        vizData[posDate].lignes[posLigne].girouettes.push({ girouette: csvData[i].Girouette, voyages: [] })
        posGirouette = vizData[posDate].lignes[posLigne].girouettes.length - 1
      }

      // On ajoute le voyage s'il n'existe pas déjà dans vizData
      var posVoyage = vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages.findIndex(e => e.voyage === csvData[i].voyage)
      if (posVoyage === -1) {
        vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages.push({ voyage: csvData[i].voyage, arrets: [] })
        posVoyage = vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages.length - 1
      }

      // On ajoute l'arrêt s'il n'existe pas déjà dans vizData
      var posArret = vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.findIndex(e => e.codeArret === csvData[i].arret_code)
      if (posArret === -1) {
        vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.push(
          {
            codeArret: csvData[i].arret_code,
            nomArret: csvData[i].arret_nom,
            sequenceArret: csvData[i].sequence_arret,
            minutesEcart: csvData[i].Minutes_ecart_planifie,
            nClients: csvData[i].montants,
            ponctualite: csvData[i].Etat_Ponctualite,
            minutesEcartClient: csvData[i].Minutes_ecart_planifie * csvData[i].montants
          })
        posArret = vizData[posDate].lignes[posLigne].girouettes[posGirouette].voyages[posVoyage].arrets.length - 1
      }
    }
  }
}
