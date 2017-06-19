/**
* @desc getLetterFrequencies() Builds an map of letters and their frequencies for a given word list
*
* @param {array} [possibleWords] - Array of words
*
* @return {object} - A map of letters and thier frequencies in the given word list
*/
function getLetterFrequencies(possibleWords) {

  //Initialize an object to keep track of letter frequencies
  let letterFrequencies = {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0};

  //For each word in our list of possible words
  let i = possibleWords.length;
  while(i--) {

    //Store the current word in a variable
    let word = possibleWords[i];

    //Initialize an object to keep track of letters which have already occured in the current word
    let usedCharacters = {};

    //For each character in the current word
    let j = word.length-2;
    while(j > 0) {

      //Store the current character in a variable
      let character = word.charAt(j);

      //If this letter hasn't appeared in this word yet
      if(!usedCharacters.hasOwnProperty(character)) {

        //Add one million to the value for this letter in our character count object
        letterFrequencies[character] += 1000000;

        //Add this letter to the list of letters which have already appeared in this word
        usedCharacters[character] = true;

      }

      //If this letter has already appeared in this word
      else {

        //Add one to the value for this letter in our character count object
        letterFrequencies[character] += 1;

      }

      //Move on to the next letter
      j--;

    }

  }

  //Return the letter frequencies
  return letterFrequencies;

}

/**
* @desc getMostCommonLetter() Given a letter frequencies object, find the most common letter not already used
*
* @param {object} [letterFrequencies] - Map of letter frequencies
* @param {string} [usedLetters] - List of already used letters
*
* @return {string} - The most common, not already guessed letter
*/
function getMostCommonLetter(letterFrequencies, usedLetters) {

  //Initialize variables to keep track of the most common letter so far
  let highestCount = 0;
  let highestLetter = '';

  //Get all the keys of the letterFrequencies object
  let keys = Object.keys(letterFrequencies);

  //Get the total number of keys in the letterFrequencies object
  let k = keys.length;

  //For each letter in our letterFrequencies object
  while(k--) {

    //If it's not in the already used letter list and it's got a higher value than any letter so far
    if(usedLetters.indexOf(keys[k]) === -1 && letterFrequencies[keys[k]] > highestCount) {

      //Update our variables which keep track of the most commonly used letter
      highestCount = letterFrequencies[keys[k]];
      highestLetter = keys[k];

    }

  }

  //Return the highest unused letter
  return highestLetter;

}

/**
* @desc nextGuess() Figure out what letter to guess next (and what the resulting list of possible words will be)
*
* @param {string} [gameState] - String representing the current game state (ex: h__s_)
* @param {string} [usedLetters] - List of already used letters
* @param {string} [remainingLetters] - List of unused letters in brackets (ex: [kvxzjq])
* @param {string} [wordList] - List of words that could be solutions to the current game state, separated by commas (ex: ,ace,,add,,are,,dad,)
*
* @return {object} - The letter to guess next and the resulting word list
*/
function nextGuess(gameState, usedLetters, remainingLetters, wordList) {

  //Replace all underscores in the game state with our bracket string
  let regex = new RegExp('\,('+gameState.replace(/_/g, remainingLetters)+')\,', 'gi');

  //Get all possible words for the current game state
  let possibleWords = wordList.match(regex);

  //If we didn't match any words in our dictionary
  if(possibleWords.length === 0) {

    //Send back whatever the next most common letter in english is
    return {letter: remainingLetters.charAt(1);, wordList: wordList};

  }

  //Update our word list to the new (reduced) set of words
  wordList = possibleWords.join('');

  //Get the letter frequencies for all letters in all the words in our list
  let letterFrequencies = getLetterFrequencies(possibleWords);

  //Find the most commonly used letter based on our letterFrequencies object
  let highestLetter = getMostCommonLetter(letterFrequencies, usedLetters);

  return {letter: highestLetter, wordList: wordList};

}

module.exports = nextGuess;
