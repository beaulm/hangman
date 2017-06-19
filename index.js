const getWordList = require('./get-word-list');
const rp = require('request-promise');
const nextGuess = require('./next-guess');

let wordList = {list: ''};
let remainingLetters = '[eariotnslcudpmhgbfywkvxzjq]';
let usedLetters = '';

//Start a new game of hangman
rp({method: 'POST', uri: 'http://hangman-api.herokuapp.com/hangman', json: true}).

//When the new game is created
then(async (response) => {

  //Store the token to send with the next request
  let {token, hangman: gameState} = response;

  //Initialize a variable to keep track of the number of wrong guesses
  let incorrectGuesses = 0;

  //Get all the words that are the right length for this game state
  wordList.list = await getWordList(gameState.length);

  //As long as the game state has an underscore and we haven't made five or more incorrect guesses
  while(gameState.indexOf('_') !== -1 && incorrectGuesses < 5) {

    //Get the next letter to guess
    let guess = nextGuess(gameState, usedLetters, remainingLetters, wordList);

    //If there was a problem getting the next letter to guess
    if(guess instanceof Error) {

      //Tell the user about it
      throw guess;

    }

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
    catch((err) => {
      console.log('There was a problem guessing the next letter.', err);
      incorrectGuesses = 5;
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

}).
catch((err) => {
  console.log('There was an error starting a new game.', err);
});
