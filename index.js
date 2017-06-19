const rp = require('request-promise');

let letters = 'EARIOTNSLCUDPMHGBFYWKVXZJQ'.split('');

//Start a new game of hangman
rp({method: 'POST', uri: 'http://hangman-api.herokuapp.com/hangman', json: true})

//When the new game is created
.then(async (response) => {

  //Store the token to send with the next request
  let token = response.token;

  //Store the game state in a variable
  let gameState = response.hangman;

  //Initialize a variable to keep track of the number of wrong guesses
  let incorrectGuesses = 0;

  //As long as the game state has an underscore and we haven't made five or more incorrect guesses
  while(gameState.indexOf('_') !== -1 && incorrectGuesses < 5) {

    //Get the next letter to guess
    let guess = letters.shift();

    console.log('Game state: '+gameState+' Next guess: '+guess);

    //Guess another letter
    await rp({method: 'PUT', uri: 'http://hangman-api.herokuapp.com/hangman', json: true, qs: {
      token: token,
      letter: guess
    }})
    .then((response) => {

      //Update the token
      token = response.token;

      //Update the game state
      gameState = response.hangman;

      //If we guessed wrong
      if(!response.correct) {

        //Increment the number of incorrect guesses
        incorrectGuesses++;

      }

    })
    .catch(function (err) {
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

})
.catch(function (err) {
  console.log('Some sort of error occurred', err);
});
