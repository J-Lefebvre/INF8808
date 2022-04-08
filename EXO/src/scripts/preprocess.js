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
 * jour_semaine {0, 1, 2, 3, 4, 5, 6} où 0 = Lundi
 * type_jour {semaine, fin de semaine}
 * ferie {true, false}
 *
 * @param {object[]} data The data to be displayed
 */
export function addDayType(data) {
  for (var i = 0; i < data.length; i++) {
    // jour_semaine
    var d = new Date(data[i].date)
    data[i].jour_semaine = d.getDay()

    // type_jour
    if(data[i].jour_semaine === (5 || 6)){
      data[i].type_jour = "fin de semaine"
    }
    else{
      data[i].type_jour = "semaine"
    }
    
    // ferie
    if(data[i].voyage.includes('F')){
      data[i].ferie = "true"
    }
    else{
      data[i].ferie = "false"
    }

    console.log(data[i])
  }
}