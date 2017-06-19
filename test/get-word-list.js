let {assert, expect} = require('chai');
let {describe, it} = require('mocha');
let getWordList = require('../get-word-list');

describe('getWordList', () => {

  it('should give you a list of words of the supplied length', () => {

    getWordList(1).
      then((wordList) => {
        assert.equal(',a,,b,,c,,d,,e,,f,,g,,h,,i,,y,,j,,k,,l,,m,,n,,o,,p,,q,,r,,s,,t,,u,,v,,w,,x,,z,', wordList);
      });

    getWordList(31).
      then((wordList) => {
        assert.equal(',dichlorodiphenyltrichloroethane,', wordList);
      });

  });

  it('should return an error if there was a problem', function() {

    getWordList('a').
      catch((err) => {
        expect(err).to.be.an.instanceof(Error);
      });

    getWordList(1.1).
      catch((err) => {
        expect(err).to.be.an.instanceof(Error);
      });

    getWordList(-1).
      catch((err) => {
        expect(err).to.be.an.instanceof(Error);
      });

    getWordList(32).
      catch((err) => {
        expect(err).to.be.an.instanceof(Error);
      });

  });

});
