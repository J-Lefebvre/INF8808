'use strict'

import * as helper from './scripts/helper.js'
import * as heatmap from './scripts/heatmap.js'
import * as preprocess from './scripts/preprocess.js'

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

  build()

  /**
   *   Cette fonction construit la page web
   */
  function build () {
    d3.csv('./donnees_L9_L22.csv').then(function(data) {
      preprocess.addDayType(data)
    })
  }
})(d3)
