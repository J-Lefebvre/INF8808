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



/**
 * @param vizData       // les données
 * @param ligne         // le numero de ligne, type int
 * @param girouette     // le nom de la girouette, type string
 * @param indicateur    // donnee a visualisaer, 1 choix pamis [Ponctualite, Achalandage, IndiceMixte]
 */
export function drawHeatmap (vizData, ligne, girouette, indicateur) {
  var posLigne = vizData.findIndex(e => e.ligne === ligne)
  var posGirouette = vizData[posLigne].girouettes.findIndex(e => e.girouette === girouette)
  var dataUtiles = vizData[posLigne].girouettes[posGirouette]

  

/*
  for (var v = 0; v < vizData[posLigne].girouettes[posGirouette].voyages.length; v++) {
    for (var a = 0; a < vizData[posLigne].girouettes[posGirouette].voyages[v].arrets.length; a++) {
      var valueSquare = vizData[posLigne].girouettes[posGirouette].voyages[v].arrets[a][indicateur]
      //console.log(valueSquare)
    }
  }
  */
}




