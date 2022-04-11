'use strict'

import * as helper from './scripts/helper.js'
import * as heatmap from './scripts/heatmap.js'
import * as preprocess from './scripts/preprocess.js'
import * as groupedQuantile from './scripts/grouped-quantile.js'

/**
 * @file 
 * @author Adam Prévost, Armelle Jézéquel, Clara Serruau, Jules Lefebvre, Julien Dupuis
 * @version 1.0.0
 * 
 * La structure du projet est inspirée de celle employé pour les TPs de INF8808 créée par Olivia Gélinas.
 */

(function (d3) {
  const svgSize = {
    width: 800,
    height: 625
  }

  helper.setCanvasSize(svgSize.width, svgSize.height)
  helper.generateMapG(svgSize.width, svgSize.height)
  helper.generateMarkerG(svgSize.width, svgSize.height)
  helper.appendGraphLabels(d3.select('.main-svg'))
  helper.initPanelDiv()

  // Solution temporaire, éventuellement l'utilisateur peut choisir la période qui l'intéresse, s'il veut inclure les week-end et les fériés.
  const startDate = new Date('2021-09-01')
  const endDate = new Date('2021-12-01')
  const typeJour = 'semaine'
  const ferie = false

  var vizData = []

  build()
  groupedQuantile.generateViz3();

  /**
   *   Cette fonction construit la page web
   */
  function build () {
    d3.csv('./donnees_L9_L22.csv').then(function (csvData) {
      // Change les string pour les types appropriés
      csvData.forEach(function (d) {
        d.date = new Date(d.date + ' 00:00:00')
        d.ligne = +d.ligne
        d.voyage = +d.voyage
        d.arret_code = +d.arret_code
        d.montants = +d.montants
        d.Minutes_ecart_planifie = +d.Minutes_ecart_planifie
        d.sequence_arret = +d.sequence_arret
        d.arret_Latitude = +d.arret_Latitude
        d.arret_Longitude = +d.arret_Longitude
      })
      //console.log(csvData)
      preprocess.addDayType(csvData)
      preprocess.aggregateData(csvData, vizData, startDate, endDate, typeJour, ferie)
      console.log(vizData)
      heatmap.drawHeatmap(vizData, 9, 'Lafontaine Via Gare  Saint-Jérôme', 'moyMinutesEcart')
    })
  }
})(d3)
