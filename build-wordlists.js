const readline = require('readline');
const fs = require('fs');

//Initialize our store of words
let store = {};

//Create an interface to stream our word list
const lineReader = readline.createInterface({

  input: fs.createReadStream('words_alpha.txt')

});

//For each line in our word list
lineReader.on('line', (word) => {

  //Get the size of the word
  let wordSize = word.length;

  //If this is the first word of its size
  if(!store.hasOwnProperty(wordSize)) {

    //Add a new key/value pair to the store for this word
    store[wordSize] = `,${word},`;

  }

  //Otherwise
  else {

    //Append this word to the list of words with the same size in the store
    store[wordSize] += `,${word},`;

  }

});

//When we're all done reading the file!
lineReader.on('close', () => {

  //Create a write stream
  let stream = fs.createWriteStream('wordlists.txt');

  //Once the stream is initialized
  stream.once('open', (err) => {

    //For every size a word could be
    for(let i = 1; i<=31; i++) {

      //Write all possible words of that size to the stream
      stream.write(store[i]+'\n');

    }

    //Close the stream
    stream.end();

  });

});
