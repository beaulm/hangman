const readline = require('readline');
const fs = require('fs');

//Initialize our store of words
let store = {};

//Create an interface to stream our word list
const lineReader = readline.createInterface({

  input: fs.createReadStream('test-words.txt')

});

//For each line in our word list
lineReader.on('line', function(word) {

  //Cache the word length
  let wordLength = word.length;

  //For one until the square of the length of the word (we're gonna do a kinda binary bitmask to get all possible substrings)
  for(let i=0, end=Math.pow(2,wordLength)-1; i<end; i++) {

    //Get the binary representation of the current count (i.e. 5 => 101)
    let binary = i.toString(2); //TODO: Cache all possible binary strings we might encounter.

    //Pad our binary number with zero's until it's the same length as the word (If the word was 'House' and we're on number 5, we want 00101)
    binary = pad(binary, wordLength);

    //Initialize a new string which will represent our game state
    let possibleState = '';

    //Initialize a character count object to keep track of the characters that make up the underscores in our game state
    let characterCounts = {};

    //Initialize an object to keep track of characters we've already used in the current state
    let usedCharacters = {};

    //Initialize a flag to know if we found an invalid state (such as d__ from dad -- both d's must be present at once or the word is invalid)
    let badState = false;

    //For each digit in the binary representation of the current count, starting from the right-most digit
    for(let j=wordLength-1; j>=0; j--) {

      //Get the character at the corresponding place in the original word
      let character = word.charAt(j);

      //If the current binary digit is a one
      if(binary.charAt(j) === '1') {

        //If the current character is already in our character count object
        if(characterCounts.hasOwnProperty(character)) {

          //Set a flag so we skip the outer loop
          badState = true;

          //Move on to the next word
          break;

        }

        //Append the character at that place in the original string to our possibleState string
        possibleState = character + possibleState;

        //Add the character to our used character object
        usedCharacters[character] = true;

      }

      //If the current binary digit is a zero
      else {

        //If the current character is already in our used character object
        if(usedCharacters.hasOwnProperty(character)) {

          //Set a flag so we skip the outer loop
          badState = true;

          //Move on to the next word
          break;

        }

        //Append an underscore to our possible state
        possibleState = '_' + possibleState;

        //If the current character isn't already in our characterCounts object
        if(!characterCounts.hasOwnProperty(character)) {

          //Add it to the count object with a starting value of one million
          characterCounts[character] = 1000000;

        }

        //If the current character is already in our characterCounts object
        else {

          //Add one to the count for the current character (this is to help resolve ties later on)
          characterCounts[character] += 1;

        }

      }

    }

    //If we were working with an invalid state
    if(badState) {

      //Just move on to the next word
      continue;

    }

    //If the possibleState isn't already in the store
    if(!store.hasOwnProperty(possibleState)) {

      //Add it to the store
      store[possibleState] = {};

    }

    //Add the character counts to the existing values for this state in the store
    store[possibleState] = addCounts(characterCounts, store[possibleState]);

  }

});

//When we're all done reading the file!
lineReader.on('close', function(word) {

  //Write our store to a file
  fs.writeFile('dictionary-tiny.txt', JSON.stringify(store), (err) => {

    if (err) throw err;

    console.log('The file has been saved!');

  });

});


//Left pad a string with zero's up to a certain length
function pad(number, length) {

  while(number.length < length) {

    number = '0' + number;

  }

  return number;

}

//This will be more efficient if the countsOne object is "smaller" (has fewer keys)
function addCounts(countsOne, countsTwo) {

  //Get all the keys of the first object
  let keys = Object.keys(countsOne);

  //Get the total number of keys in the first object
  let i = keys.length;

  //For each key in the countsOne object
  while(i--) {

    //If countsTwo already has a corresponding key
    if(countsTwo.hasOwnProperty(keys[i])) {

      //Add the value from countsOne to the corresponding value in countsTwo
      countsTwo[keys[i]] += countsOne[keys[i]];

    }

    //If countsTwo doesn't already have a corresponding key
    else {

      //Add a new key to countsTwo with the value from countsOne
      countsTwo[keys[i]] = countsOne[keys[i]];

    }

  }

  //Return countsTwo
  return countsTwo;
}
