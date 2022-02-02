// INF8808 - TP2
// Groupe 4
//
// Clara Serruau - 2164678
// Julien Dupuis - 1960997
// Adam Prévost - 1947205
// Jules Lefebvre - 1847158
//
/**
 * Sanitizes the names from the data in the "Player" column.
 *
 * Ensures each word in the name begins with an uppercase letter followed by lowercase letters.
 *
 * @param {object[]} data The dataset with unsanitized names
 * @returns {object[]} The dataset with properly capitalized names
 */
export function cleanNames(data) {
  // TODO: Clean the player name data
  data.forEach((element) => {
    element.Player = element.Player.split(' ') // We care for names with multiple words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // We capitalize each string correctly in the array
      .join(' ') // We recreate the string
  })
  return data
}

/**
 * Finds the names of the 5 players with the most lines in the play.
 *
 * @param {object[]} data The dataset containing all the lines of the play
 * @returns {string[]} The names of the top 5 players with most lines
 */
export function getTopPlayers(data) {
  // TODO: Find the five top players with the most lines in the play
  var count = {} // We create a structure with the name of the player as a key and build its line count in its value
  data.forEach((element) => {
    if (!count.hasOwnProperty(element.Player)) {
      // We create the keys as we encounter them in the data
      count[element.Player] = 1
    } else {
      count[element.Player] += 1
    }
  })
  // We convert our structure to a  decreading sorted list of players names based of their counts
  var nameSorted = Object.keys(count).sort((a, b) => {
    return count[b] - count[a]
  })
  // We return only the top 5
  return nameSorted.slice(0, 5)
}

/**
 * Transforms the data by nesting it, grouping by act and then by player, indicating the line count
 * for each player in each act.
 *
 * The resulting data structure ressembles the following :
 *
 * [
 *  { Act : ___,
 *    Players : [
 *     {
 *       Player : ___,
 *       Count : ___
 *     }, ...
 *    ]
 *  }, ...
 * ]
 *
 * The number of the act (starting at 1) follows the 'Act' key. The name of the player follows the
 * 'Player' key. The number of lines that player has in that act follows the 'Count' key.
 *
 * @param {object[]} data The dataset
 * @returns {object[]} The nested data set grouping the line count by player and by act
 */
export function summarizeLines (data) {
  // TODO : Generate the data structure as defined above
  // We are not supposed to know the total number of Acts, so we store the Act number as the index of the array "ActList"
  // We can't build the desired structure with one loop because we can't query the existing object for a specific player. We build an intermediate structure to help us count the lines in a first loop.
  var ActList = []
  var SummerizedList = []
  data.forEach((element) => {
    if (typeof ActList[parseInt(element.Act)] == "undefined") {
      // We create the new containers for new acts as we encounter them in the list
      ActList[parseInt(element.Act)] = { [element.Player]: 1 }
    } else if (
      typeof ActList[parseInt(element.Act)][element.Player] == "undefined"
    ) {
      // We encounter a new player to count lines from in an existing act
      ActList[parseInt(element.Act)][element.Player] = 1;
    } else {
      ActList[parseInt(element.Act)][element.Player] += 1;
    }
  });
  for (var i = 0; i < ActList.length; i++) {
    // We build the desired final structure. We chose to use a for loop instead of a foreach to access the act number (as we decided not to store it directly)
    if (typeof ActList[i] != 'undefined') {
      // We care for empty acts, but leave the possibility of an Act 0 ! (why not)
      SummerizedList.push({
        Act: i,
        Players: Object.entries(ActList[i]).map((array) => {
          return { Player: array[0], Count: array[1] }
        })
      })
    }
  }
  return SummerizedList
}

/**
 * For each act, replaces the players not in the top 5 with a player named 'Other',
 * whose line count corresponds to the sum of lines uttered in the act by players other
 * than the top 5 players.
 *
 * @param {object[]} data The dataset containing the count of lines of all players
 * @param {string[]} top The names of the top 5 players with the most lines in the play
 * @returns {object[]} The dataset with players not in the top 5 summarized as 'Other'
 */
export function replaceOthers (data, top) {
  // TODO : For each act, sum the lines uttered by players not in the top 5 for the play
  // and replace these players in the data structure by a player with name 'Other' and
  // a line count corresponding to the sum of lines
  data.forEach((act) => {
    // We will recreate the array "Players" as it is difficult to erase unamed objects from it
    var count = 0 // We will store the count of the players not in the top 5
    var newPlayers = [] // We initialize the new array for "Players"
    act.Players.forEach((player) => {
      if (!top.includes(player.Player)) {
        // player is not in the top 5
        count += player.Count
      } else {
        // player is in the top 5
        newPlayers.push(player)
      }
    });
    newPlayers.push({ Player: 'Other', Count: count }) // We add the new object to the Array "Players"
    act.Players = newPlayers
  })
  return data
}
