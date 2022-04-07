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
 * jour_semaine {0, 1, 2, 3, 4, 5, 6} où 0 = dimanche
 * type_jour {semaine, fin de semaine}
 * ferie {true, false}
 *
 * @param {object[]} data The data to be displayed
 */
export function addDayType(data) {
  for (var row in data) {
    // jour_semaine
    var d = new Date(row.date)
    row.jour_semaine = d.getDay()

    // type_jour
    if(row.jour_semaine === (0 || 6)){
      row.type_jour = "fin de semaine"
    }
    else{
      row.type_jour = "semaine"
    }
    
    // ferie
    if(row.voyage.includes('F')){
      row.ferie = "true"
    }
    else{
      row.ferie = "false"
    }

    console.log(row)
  }
}