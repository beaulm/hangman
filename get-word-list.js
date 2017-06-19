const readline = require('readline');
const fs = require('fs');

/**
* @desc getWordList() Get all the english words of a given length
*
* @param {integer} [wordLength] - The length of words to get
*
* @return {string} - A pre-formatted string of all words with a given length (ex: ',ace,,add,,are,,add,');
*/
function getWordList(wordLength) {

  //Return a promise that will resolve after we've gotten the list of words of the appropriate length
  return new Promise((resolve, reject) => {

    //If wordlength isn't an integer between 1 and 31 inclusive
    if(typeof wordLength !== 'number' || !Number.isInteger(wordLength) || wordLength < 1 || wordLength > 31) {

      //Reject the promise right off the bat
      reject(new Error(`Invalid wordLength (${wordLength}) supplied to getWordList. Make sure wordLength is an integer between 1 and 31 inclusive`));

    }

    //Read in our pre-formatted word list
    const lineReader = readline.createInterface({input: fs.createReadStream('wordlists.txt')});

    //Start on line number 1
    let lineNumber = 1;

    //For each line in our word list
    lineReader.on('line', (text) => {

      //When we reach the line number that matches the size of our gameState
      if(lineNumber === wordLength) {

        //Stop reading the file
        lineReader.close();

        //Return the word list
        resolve(text);

      }

      //Move on to the next line
      lineNumber++

    });

  });

}

module.exports = getWordList;
