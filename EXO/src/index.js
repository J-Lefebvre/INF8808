'use strict'

import * as helper from './scripts/helper.js'
import * as heatmap from './scripts/heatmap.js'
import * as preprocess from './scripts/preprocess.js'
import * as groupedQuantile from './scripts/grouped-quantile.js'

/**
 * @file
 * @author
 * @version
 */

(function (d3) {
  
  groupedQuantile.generateViz3();
  /*const svgSize = {
    width: 800,
    height: 625
  }

  console.log("LMAO")

  helper.setCanvasSize(svgSize.width, svgSize.height)
  helper.generateMapG(svgSize.width, svgSize.height)
  helper.generateMarkerG(svgSize.width, svgSize.height)
  helper.appendGraphLabels(d3.select('.main-svg'))
  helper.initPanelDiv()

  build()

  /**
   *   This function builds the graph.
   *
  function build () {
    d3.csv('./donnees_L9_L22.csv').then(function (data) {
      
    })
  }*/
})(d3)
