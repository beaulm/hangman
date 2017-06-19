let {assert, expect} = require('chai');
let {describe, it} = require('mocha');
let nextGuess = require('../next-guess');

describe('nextGuess', () => {

  it('should give you a letter and wordlist with proper input', () => {

    let guess = nextGuess('a__', 'a', '[eriotnslcudpmhgbfywkvxzjq]', {list: ',ace,,add,,are,,dad,'});

    assert.equal('e', guess.letter);
    assert.equal(',ace,,add,,are,', guess.wordList.list);

  });

  it('should still give you a letter and wordlist even if the gamestate doesn\'t match anything in our wordlist', () => {

    let guess = nextGuess('c__', 'c', '[eariotnsludpmhgbfywkvxzjq]', {list: ',ace,,add,,are,,dad,'});

    assert.equal('e', guess.letter);
    assert.equal(',ace,,add,,are,,dad,', guess.wordList.list);

  });

  it('should return an error if you give it bad inputs', () => {

    let guess = nextGuess(1, 'c', '[eariotnsludpmhgbfywkvxzjq]', {list: ',ace,,add,,are,,dad,'});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('', 'c', '[eariotnsludpmhgbfywkvxzjq]', {list: ',ace,,add,,are,,dad,'});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('ace', 'c', '[eariotnsludpmhgbfywkvxzjq]', {list: ',ace,,add,,are,,dad,'});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', {}, '[eariotnsludpmhgbfywkvxzjq]', {list: ',ace,,add,,are,,dad,'});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', 'eariotnsludpmhgbfywkvxzjq]', {list: ',ace,,add,,are,,dad,'});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', '[eariotnsludpmhgbfywkvxzjq', {list: ',ace,,add,,are,,dad,'});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', '[]', {list: ',ace,,add,,are,,dad,'});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', [], {list: ',ace,,add,,are,,dad,'});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', '[eariotnsludpmhgbfywkvxzjq]', {});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', '[eariotnsludpmhgbfywkvxzjq]', {list: ''});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', '[eariotnsludpmhgbfywkvxzjq]', {list: 1});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', '[eariotnsludpmhgbfywkvxzjq]', 1);
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', '[eariotnsludpmhgbfywkvxzjq]', {list: 'ace'});
    expect(guess).to.be.an.instanceof(Error);

    guess = nextGuess('c__', 'c', '[eariotnsludpmhgbfywkvxzjq]', {list: 'ace|add'});
    expect(guess).to.be.an.instanceof(Error);

  });

});
