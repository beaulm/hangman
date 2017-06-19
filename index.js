const readline = require('readline');
const fs = require('fs');
const rp = require('request-promise');
const nextGuess = require('./next-guess');

let wordList = '';
let remainingLetters = '[eariotnslcudpmhgbfywkvxzjq]';
let usedLetters = '';

//Start a new game of hangman
rp({method: 'POST', uri: 'http://hangman-api.herokuapp.com/hangman', json: true}).

//When the new game is created
then((response) => {

  //Store the token to send with the next request
  let {token, hangman: gameState} = response;

  //Initialize a variable to keep track of the number of wrong guesses
  let incorrectGuesses = 0;

  //Read in our pre-formmated word list
  const lineReader = readline.createInterface({input: fs.createReadStream('wordlists.txt')});

  //Start on line number 1
  let lineNumber = 1;

  //For each line in our word list
  lineReader.on('line', (text) => {

    //When we reach the line number that matches the size of our gameState
    if(lineNumber === gameState.length) {

      //Update our list of possible words
      wordList = text;

    }

    //Move on to the next line
    lineNumber++

  });

  //When we've got our list of possible words
  lineReader.on('close', async () => {

    //As long as the game state has an underscore and we haven't made five or more incorrect guesses
    while(gameState.indexOf('_') !== -1 && incorrectGuesses < 5) {

      //Get the next letter to guess
      let guess = nextGuess(gameState, usedLetters, remainingLetters, wordList);

      //Update our word list to the reduced set
      ({wordList} = guess);

      console.log('Game state: '+gameState+' Next guess: '+guess.letter);

      //Guess another letter
      await rp(
        {
          method: 'PUT',
          uri: 'http://hangman-api.herokuapp.com/hangman',
          json: true,
          qs: {
            token,
            letter: guess.letter
          }
        }
      ).
      then((newResponse) => {

        //Update the token and game state
        ({token, hangman: gameState} = newResponse);

        //If we guessed wrong
        if(!newResponse.correct) {

          //Increment the number of incorrect guesses
          incorrectGuesses++;

        }

        //Remove the letter we just guessed from the list of letters still available to guess
        remainingLetters = remainingLetters.replace(guess.letter, '');

        //Add the letter we just guessed to the list of already guessed letters
        usedLetters += guess.letter;

      }).
      catch(function (err) {
        console.log('Some sort of error occurred', err);
      });

    }

    //If the game state has no underscores
    if(gameState.indexOf('_') === -1) {

      //We won!!!
      console.log('We won!!!');
      console.log('The word was '+gameState);

    }

    //If we made five or more wrong guesses
    if(incorrectGuesses >= 5) {

      //We lost :(
      console.log('We lost :(');

    }

  });

}).
catch(function (err) {
  console.log('Some sort of error occurred', err);
});
