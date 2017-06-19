let {assert} = require('chai');
let {describe, it} = require('mocha');
let nextGuess = require('../next-guess');

describe('nextGuess', () => {

  it('should give you a letter and wordlist with proper input', () => {

    let guess = nextGuess('a__', 'a', '[eriotnslcudpmhgbfywkvxzjq]', ',ace,,add,,are,,dad,');

    assert.equal('e', guess.letter);
    assert.equal(',ace,,add,,are,', guess.wordList);

  });

  it('should still give you a letter and wordlist even if the gamestate doesn\'t match anything in our wordlist', () => {

    let guess = nextGuess('c__', 'c', '[eariotnsludpmhgbfywkvxzjq]', ',ace,,add,,are,,dad,');

    assert.equal('e', guess.letter);
    assert.equal(',ace,,add,,are,,dad,', guess.wordList);

  });

});
