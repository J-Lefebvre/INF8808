// Idée générale pour l'algorithme qui parcours l'objet vizData pour recueillir les valeurs pour chaque carré de la heatmap.

/*
Structure des données pour une ligne et une girouette données:

{
  girouette (string) : "Lafontaine via gare"
  voyages ( Array ) :
  [
    {
      voyage (int) : 1
      arrets (Array) :
      [
        {
          codeArret             (int) : 82127
          nomArret              (string) : " Station Montmorency"
          moyMinutesEcart       (int) : 1.19
          moyMinutesEcartClient (int) : 3.61
          moyNClients           (int) : 5.09
          tauxPonctualité       (int) : 0.98

          minutesEcart        (Array) : [1, 2, ...]
          minutesEcartClient  (Array) : [3, 10, ...]
          nClients            (Array) : [3, 5, ...]
          Pontualite          (Array) : ["Ponctuel", "Ponctuel", ...]
        }
      ...
      ]
    }
  ...
  ]

}

*/
import * as helper from './helper.js'

// ===================== CONSTANTES  =====================
const FONT_SIZE = 14
const ID_VIZ = 'graph-heatmap'
const MARGIN = { top: 45, right: 20, bottom: 210, left: 70 }
let HEIGHT = 0
const ID_X_AXIS = 'x axis'
const ID_Y_AXIS = 'y axis'
const OPACITY = 0.75

const VERT = '#00B800'
const VERT_NEUTRE = '#E6F9E6'
const ROUGE = '#FF0000'
const BLANC = '#FFFFFF'

let bounds
let svgSize
let graphSize

/// ///////////////////////////////////////////////////////////////

/**
 * @param vizData       // les données
 * @param ligne         // le numero de ligne, type int
 * @param girouette     // le nom de la girouette, type string
 * @param indicateur    // donnee a visualisaer, 1 choix pamis [Ponctualite, Achalandage, IndiceMixte]
 */
export function drawHeatmap (vizData, ligne, girouette) {
  //d3.select("#heatmap-svg").selectAll().remove()
  document.getElementById("heatmap-svg-container").innerHTML = ''

  d3.select("#heatmap-svg-container")
    .append("svg")
    .attr('id',"heatmap-svg");

  HEIGHT = document.getElementById('heatmap-svg-container').getBoundingClientRect().height

  var indicateur = document.getElementById("indicateur").value;
  var moyenne, liste, nomIndicateur
  switch (indicateur) {
    case 'Ponctualite' :
      moyenne = 'moyMinutesEcart'
      liste = 'minutesEcart'
      nomIndicateur = 'de la ponctualité'
      break

    case 'Achalandage' :
      moyenne = 'moyNClients'
      liste = 'nClients'
      nomIndicateur = "de l'achalandage"
      break

    case 'IndiceMixte' :
      moyenne = 'moyMinutesEcartClient'
      liste = 'minutesEcartClient'
      nomIndicateur = "de l'indice combo"
      break
  }
 
  var posLigne = vizData.findIndex(e => e.ligne === ligne)
  var posGirouette = vizData[posLigne].girouettes.findIndex(e => e.girouette === girouette)
  var dataUtiles = vizData[posLigne].girouettes[posGirouette]
  
  var flattenData = flatten_Data(dataUtiles, moyenne, liste)

  const g = generateG()
  setSizing()
  appendAxes(g)
  const Xscale = createXScale(flattenData)
  const Yscale = createYScale(dataUtiles)
  const colorScale = createColorScale(flattenData)

  appendRects(flattenData)
  updateRects(Xscale, Yscale, colorScale)

  drawXAxis(Xscale)
  drawYAxis(Yscale)
  rotateXTicks()

  setRectHandler(Xscale, Yscale)

  initGradient(colorScale, nomIndicateur)
  initLegendBar()
  initLegendAxis()
  draw(MARGIN.left / 2, MARGIN.top + 5, graphSize.height - 10, 15, 'url(#gradient)', colorScale)
};


// ===================== PROCESS DATA =====================

/**
 * @param {*} dataStructurees donnees structures issues du preprocessing, pour une ligne et une girouette
 * @param {string} nom_moy
 * @param {string} nom_liste
 * retourne une liste {object[]}, ou chaque element sont les donnes pour un arret et un voyage
 */
function flatten_Data (dataStructurees, nom_moy, nom_liste) {
  const flattenData = [];
  if (typeof dataStructurees !== 'undefined'){
  (dataStructurees.voyages).forEach((v) => {
    const numVoyage = v.voyage;
    (v.arrets).forEach((a) => {
      const codeArret = a.codeArret
      const nomArret = a.nomArret
      const moyenne = a[nom_moy]
      const liste = Array. from(a[nom_liste].values())
      flattenData.push({
        voyage: numVoyage,
        codeArret: codeArret,
        nomArret: nomArret,
        sequenceArret: a.sequenceArret,
        moyenne: moyenne,
        liste: liste
      })
    })
  })}
  return flattenData
};

// ===================== SETUP =====================

// CANVAS

/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @returns {*} The d3 Selection for the created g element
 */
export function generateG () {
  return d3.select('#heatmap-svg-container')
    .select('#heatmap-svg')
    .append('g')
    .attr('id', ID_VIZ)
    .attr('transform',
      'translate(' + MARGIN.left + ',' + MARGIN.top + ')')
}

/**
 *   This function handles the graph's sizing.
 */
export function setSizing () {
  bounds = d3.select('#heatmap-svg-container').node().getBoundingClientRect()

  svgSize = {
    width: bounds.width,
    height: HEIGHT
  }

  graphSize = {
    width: svgSize.width - MARGIN.right - MARGIN.left,
    height: svgSize.height - MARGIN.bottom - MARGIN.top
  }

  helper.setCanvasSize(svgSize.width, svgSize.height)

  document.getElementById('heatmap-tooltip-aligner').style.marginTop = MARGIN.top + 'px'
}

// AXIS
/**
 * Appends an SVG g element which will contain the axes.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function appendAxes (g) {
  g.append('g')
    .attr('class', ID_X_AXIS)

  g.append('g')
    .attr('class', ID_Y_AXIS)
}

// SCALES (x, y, color Negative, color positive)
/**
 * @param {*} flattenData donnees structures issues du preprocessing, pour une ligne et une girouette
 * retourne l'echelle des X, correspondant aux arrets
 */
export function createXScale (flattenData) {
  // obtenir tous les arrets dans l'ordre
  const xScale = d3.scaleBand()
  const map_arret = d3.map()
  flattenData.forEach(a => map_arret.set(a.sequenceArret, a.nomArret))
  
  const arrets = map_arret.keys()
  const arret_sort = arrets.sort((a, b) => d3.ascending(+a, +b))
  const nom_arret_sort = [...arret_sort.map(a => map_arret.get(a))]
  xScale.domain(nom_arret_sort).range([0, graphSize.width])

  return xScale
};

/**
 * @param {*} dataStructurees donnees structures issues du preprocessing, pour une ligne et une girouette
 * retourne l'echelle des Y, correspondant aux n° de voyage
 */
export function createYScale (dataStructurees) {
  const voyages = (dataStructurees.voyages).map(v => v.voyage)
  const dom = d3.extent(voyages)
  const yScale = d3.scaleBand()
    .domain(d3.range(dom[0], dom[1]))
    .range([0, graphSize.height])
  return yScale
};

/**
 * @param {object[]} dataFlatten donnees applaties issues du preprocessing additionnel, pour une ligne et une girouette
 * @param indicateur    // donnee a visualisaer, 1 choix pamis [Ponctualite, Achalandage, IndiceMixte]
 * retourne l'echelle des couleurs des donnes vizualisees, en fonction du type de donnees
 * @param flattenData
 */
export function createColorScale (flattenData) {
  const retard = (flattenData).map(d => d.moyenne)
  const dom = d3.extent(retard)

  var color = d3.scaleLinear()
    .domain([dom[0], 0, 0.01, dom[1]])
    .range([ROUGE, BLANC, VERT_NEUTRE, VERT])

  return color
}

// ===================== DRAW RECTANGLES =====================

/**
 * @param {object[]} data The data to use for binding
 */
export function appendRects (data) {
  // TODO : Append SVG rect elements
  d3.select('#' + ID_VIZ)
    .append('g')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .append('rect')
}

/**
 * After the rectangles have been appended, this function dictates
 * their position, size and fill color.
 *
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {*} colorScale The color scale used to set the rectangles' colors
 */
export function updateRects (xScale, yScale, colorScale) {
  // TODO : Set position, size and fill of rectangles according to bound data
  d3.select('#' + ID_VIZ)
    .selectAll('rect')
    .attr('x', function (d) {
      if (typeof xScale(d.nomArret) !== 'undefined') 
      { return xScale(d.nomArret)}
      else {return -1}
    })
    .attr('y', function (d) {
      if (typeof xScale(d.nomArret) !== 'undefined') 
      {  return yScale(d.voyage)}
      else {return -1}
      
    })
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth() * 2)
    .attr('fill', function (d) {
      return colorScale(d.moyenne)
    })
    .attr('opacity', function(d) {

      if (typeof xScale(d.nomArret) !== 'undefined') 
      {return OPACITY}
      else {return 0};
    })
    .attr('class', 'rectangleChaleur')
}

// ===================== DRAW AXIS =====================

/**
 *  @param {*} xScale The scale to use to draw the axis
 */
export function drawXAxis (xScale) {
  // TODO : Draw X axis
  d3.select('.x.axis')
    .attr('transform', 'translate(0, ' + graphSize.height + ' )')
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('opacity', 1.0)
    .attr('font-size', '10px')
    .attr('font-family', 'sans-serif')
    .attr('id', (x) => {
      return x.replace(/[^a-zA-Z0-9]/g, '')
    })
}

/**
 * @param {*} yScale The scale to use to draw the axis
 */
export function drawYAxis (yScale) {
  // TODO : Draw Y axis
  d3.select('.y.axis')
    .call(d3.axisLeft(yScale).tickSize(0))
    .selectAll('text')
    .attr('opacity', 0.0)
    .attr('font-size', '10px')
    .attr('font-family', 'sans-serif')
    .attr('id', (x) => {
      return 'v' + x
    })
}

/**
 * Rotates the ticks on the X axis 45 degrees towards the left.
 */
export function rotateXTicks () {
  // TODO : Rotate X axis' ticks
  d3.select('.x.axis').selectAll('text')
    .attr('transform', 'rotate(-45)')
    .attr('text-anchor', 'end')
}

// ===================== HOVERING FEATURE =====================

/**
 *
 * @param {*} xScale The xScale to be used when placing the text in the square
 * @param {*} yScale The yScale to be used when placing the text in the square
 */
export function setRectHandler (xScale, yScale) {
  d3.selectAll(' .rectangleChaleur')
    .on('mouseenter', function (d) {
      rectSelected(this)
      selectTicks(d.nomArret, d.voyage, d.codeArret, d.moyenne, d.liste)
    })
    .on('mouseleave', function (d) {
      unselectTicks(d.nomArret, d.voyage)
      rectUnselected(this)
    })
}

/**
 * @param {*} element The selection of rectangles in "selected" state
 */
export function rectSelected (element) {
  d3.select(element).attr('opacity', 1.0)
}

/**
 * @param {*} element The selection of rectangles in "selected" state
 */
export function rectUnselected (element) {
  d3.select(element).attr('opacity', OPACITY)
  // d3.select(element.parentNode).select("text").remove();
}

/**
 * @param {string} arret
 * @param {number} voyage
 */
export function selectTicks (arret, voyage, numArret, moyenne, listeData) {

  var selection = d3.select('#' + arret.replace(/[^a-zA-Z0-9]/g, ''));

  selection.attr('font-weight', 1000)
    .attr('font-size', '10px')
    .attr('opacity', 1.0)

  d3.select('#v' + voyage)
    .attr('font-weight', 1000)
    .attr('font-size', '10px')
    .attr('opacity', 1.0)

  setTooltip(arret, voyage, numArret, moyenne, listeData)
  d3.select("#heatmap-tooltip-aligner")
    .style('visibility', 'visible');
}

/**
 * @param arret
 * @param voyage
 */
export function unselectTicks (arret, voyage) {
  // TODO : Unselect the ticks
  d3.select('#' + arret.replace(/[^a-zA-Z0-9]/g, ''))
    .attr('font-weight', 'normal')
    .attr('font-size', '10px')
    .attr('opacity', 1.0)
  d3.select('#v' + voyage)
    .attr('font-weight', 'normal')

    .attr('font-size', '10px')
    .attr('opacity', 0.0)
  d3.select("#heatmap-tooltip-aligner")
    .style('visibility', 'hidden');
}

// ===================== LEGEND =====================

/**
 * Initializes the definition for the gradient to use with the
 * given colorScale.
 *
 * @param {*} colorScale The color scale to use
 * @param {String} nomIndicateur Nom de l'indicateur visualisé
 */
export function initGradient (colorScale, nomIndicateur) {
  const svg = d3.select('#heatmap-svg')

  svg.append('text')
    .attr('x', (svgSize.width - MARGIN.right - MARGIN.left) / 2 + MARGIN.left)
    .attr('y', MARGIN.top - FONT_SIZE * 2)
    .attr('text-anchor', 'middle')
    .text('Carte de chaleur '+nomIndicateur)
    .attr('font-size', FONT_SIZE)

  const defs = svg.append('defs')

  const linearGradient = defs
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('y1', '100%')
    .attr('x2', '0%')
    .attr('y2', '0%')
    // .attr("opacity", OPACITY);

  const csd = colorScale.domain()
  const range_csd = csd[csd.length - 1] - csd[0]

  linearGradient
    .selectAll('stop')
    .data(csd)
    .enter().append('stop')
    .attr('offset', function (d) { return ' ' + ((d - csd[0]) / range_csd * 100) + '%' })
    .attr('stop-color', (d) => colorScale(d))
}

/**
 * Initializes the SVG rectangle for the legend.
 */
export function initLegendBar () {
  const svg = d3.select('#heatmap-svg')
  svg.append('rect')
    .attr('class', 'legend bar')
    .attr('opacity', OPACITY)
}

/**
 *  Initializes the group for the legend's axis.
 */
export function initLegendAxis () {
  const svg = d3.select('#heatmap-svg')
  svg.append('g').attr('class', 'legend axis')
}

/**
 * Draws the legend to the left of the graphic.
 *
 * @param {number} x The x position of the legend
 * @param {number} y The y position of the legend
 * @param {number} height The height of the legend
 * @param {number} width The width of the legend
 * @param {string} fill The fill of the legend
 * @param {*} colorScale The color scale represented by the legend
 */
export function draw (x, y, height, width, fill, colorScale) {
  const csd = colorScale.domain()

  d3.select('.legend.bar')
    .attr('x', x)
    .attr('y', y)
    .attr('height', height)
    .attr('width', width)
    .attr('fill', fill)

  const maxValue = csd[csd.length - 1]
  const minValue = csd[0]
  const step = Math.round((maxValue - minValue ) /16)
  const steps = d3.range(minValue, maxValue, step)

  const scale = d3.scaleLinear().domain([csd[0], csd[csd.length - 1]]).range([0, height])
  const axis = d3.select('.legend.axis')

  axis.attr('transform', 'translate(-10, ' + y + ')')

  axis
    .selectAll('text')
    .data(steps)
    .enter()
    .append('text')
    .text((d) => parseInt(d).toLocaleString())
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif')
    .attr('x', x)
    .attr('y', function (d) {
      return scale(maxValue) - scale(d)
    })
}

// ===================== TOOLTIP =====================

function setTooltip(arret, voyage, numArret, moyenne, listeData) {
  const tooltip = document.getElementById('heatmap-tooltip-text')
  tooltip.innerHTML = `Arrêt: ${arret}<br> 
                       Code de l'arret : ${numArret}<br>
                       Voyage: ${voyage}<br>
                       Moyenne: ${moyenne.toPrecision(3)}<br>
                       `
  updateHistogram(listeData);
  d3.select("#heatmap-tooltip-aligner")
    .style('visibility', 'hidden');
}
function updateHistogram(listeData){
  var margin = {top: 10, right:10, bottom: 30, left: 30},
  width = 160 - margin.left - margin.right,
  height = 120 - margin.top - margin.bottom;

d3.select("#heatmap-tooltip-histogram").select("svg").remove()
var svg = d3.select("#heatmap-tooltip-histogram")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let max=Math.max(listeData)
let min=Math.min(listeData)

  var x_scale = d3.scaleBand()
      .domain(listeData.sort((a, b) => (a - b)))   
      .range([0, width])
      .padding(0.3);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom().scale(x_scale));
  var counts={}
      for (const num of listeData) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      var keys = Object.keys(counts);
    var L=[];
    for (const k of keys){
      var obj = {};
      obj["x"]=parseInt(k);
      obj["y"]=counts[k];
      L.push(obj)
    }
   
      
 var M=L.map(a=>parseInt(a["y"]));

  var y_scale = d3.scaleLinear()
      .domain([0, Math.max(...M)])
      .range([height, 0]);
      
  svg.append("g")
      .call(d3.axisLeft(y_scale));

  svg.selectAll("rect")
    .data(L)
      .enter()
      .append("rect")
        .attr("x",function(d){return x_scale(d.x)})
        .attr("transform", function(d) { return "translate(" +0+ "," + y_scale(d.y) + ")"; })
        .attr("width", function(d) { return x_scale.bandwidth() ; })
        .attr("height", function(d) { return height - y_scale(d.y); })
        .style("fill", "#5b5b5b")
}