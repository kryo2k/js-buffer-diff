import { expect } from 'chai';
import 'mocha';

import { diff, commit, revert, IBufferChange } from './buffer-diff';

const
B  = new Buffer([]),
BZ = new Buffer([0]),
BO = new Buffer([1]),
BZZ = new Buffer([0,0]),
BZO = new Buffer([0,1]),
BOO = new Buffer([1,1]),
BOZZ = new Buffer([1,0,0]),
BZOZ = new Buffer([0,1,0]),
BZZO = new Buffer([0,0,1]),
BOOZO = new Buffer([1,1,0,1]),
BZZOOOZO  = new Buffer([0,0,1,1,1,0,1]),
BOOOZOZZO = new Buffer([1,1,1,0,1,0,0,1]);

describe('diff', () => {

  it('Can calculate diff | [0] ==> []', () => {

    const changes = diff(BZ, B);

    expect(changes.length).to.eq(1);
    expect(changes[0].index).to.eq(0);
    expect(changes[0].left).to.deep.eq(BZ);
    expect(changes[0].right).to.deep.eq(B);
  });

  it('Can calculate diff | [] ==> [0]', () => {

    const changes = diff(B, BZ);

    expect(changes.length).to.eq(1);
    expect(changes[0].index).to.eq(0);
    expect(changes[0].left).to.deep.eq(B);
    expect(changes[0].right).to.deep.eq(BZ);
  });


  it('Can calculate diff | [0] ==> [1]', () => {

    const changes = diff(BZ, BO);

    expect(changes.length).to.eq(1);
    expect(changes[0].index).to.eq(0);
    expect(changes[0].left).to.deep.eq(BZ);
    expect(changes[0].right).to.deep.eq(BO);
  });

  it('Can calculate diff | [0,0] ==> [0,1]', () => {

    const changes = diff(BZZ,BZO);

    expect(changes.length).to.eq(1);
    expect(changes[0].index).to.eq(1);
    expect(changes[0].left).to.deep.eq(BZ);
    expect(changes[0].right).to.deep.eq(BO);
  });

  it('Can calculate diff | [0,0] ==> [1]', () => {

    const changes = diff(BZZ, BO);

    expect(changes.length).to.eq(1);
    expect(changes[0].index).to.eq(0);
    expect(changes[0].left).to.deep.eq(BZZ);
    expect(changes[0].right).to.deep.eq(BO);
  });

  it('Can calculate diff | [0] ==> [1,1]', () => {

    const changes = diff(BZ, BOO);

    expect(changes.length).to.eq(1);
    expect(changes[0].index).to.eq(0);
    expect(changes[0].left).to.deep.eq(BZ);
    expect(changes[0].right).to.deep.eq(BOO);
  });

  it('Can calculate diff | [0,0] ==> [1,1]', () => {

    const changes = diff(BZZ, BOO);

    expect(changes.length).to.eq(1);
    expect(changes[0].index).to.eq(0);
    expect(changes[0].left).to.deep.eq(BZZ);
    expect(changes[0].right).to.deep.eq(BOO);
  });

  it('Can calculate diff | [0,0] ==> [0,0,1]', () => {

    const changes = diff(BZZ, BZZO);

    expect(changes.length).to.eq(1);
    expect(changes[0].index).to.eq(2);
    expect(changes[0].left).to.deep.eq(B);
    expect(changes[0].right).to.deep.eq(BO);
  });

  it('Can calculate diff | [0,0,1] ==> [0,0]', () => {

    const changes = diff(BZZO, BZZ);

    expect(changes.length).to.eq(1);
    expect(changes[0].index).to.eq(2);
    expect(changes[0].left).to.deep.eq(BO);
    expect(changes[0].right).to.deep.eq(B);
  });

  it('Can calculate diff | [1,1,0,1] ==> [0,1,0]', () => {

    const changes = diff(BOOZO, BZOZ);

    expect(changes.length).to.eq(3);
    expect(changes[0].index).to.eq(0);
    expect(changes[0].left).to.deep.eq(B);
    expect(changes[0].right).to.deep.eq(BZ);

    expect(changes[1].index).to.eq(2);
    expect(changes[1].left).to.deep.eq(BO);
    expect(changes[1].right).to.deep.eq(B);

    expect(changes[2].index).to.eq(3);
    expect(changes[2].left).to.deep.eq(BO);
    expect(changes[2].right).to.deep.eq(B);
  });

  it('Can calculate diff | [1,1,1,0,1,0,0,1] ==> [0,0,1,1,1,0,1]', () => {

    const changes = diff(BOOOZOZZO,BZZOOOZO);

    expect(changes.length).to.eq(2);
    expect(changes[0].index).to.eq(0);
    expect(changes[0].left).to.deep.eq(B);
    expect(changes[0].right).to.deep.eq(BZZ);

    expect(changes[1].index).to.eq(7);
    expect(changes[1].left).to.deep.eq(BZZO);
    expect(changes[1].right).to.deep.eq(B);
  });
});

describe('commit', () => {
  it('Can commit diff | [0] ==> []', () => {
    const
    changes = diff(BZ, B),
    committed = commit(BZ, ... changes);

    expect(committed).to.deep.eq(B);
  });

  it('Can commit diff | [] ==> [0]', () => {
    const
    changes = diff(B, BZ),
    committed = commit(B, ... changes);

    expect(committed).to.deep.eq(BZ);
  });

  it('Can commit diff | [0] ==> [1]', () => {
    const
    changes = diff(BZ, BO),
    committed = commit(BZ, ... changes);

    expect(committed).to.deep.eq(BO);
  });

  it('Can commit diff | [0,0] ==> [0,1]', () => {
    const
    changes = diff(BZZ,BZO),
    committed = commit(BZZ, ... changes);

    expect(committed).to.deep.eq(BZO);
  });

  it('Can commit diff | [0,0] ==> [1]', () => {
    const
    changes = diff(BZZ, BO),
    committed = commit(BZZ, ... changes);

    expect(committed).to.deep.eq(BO);
  });

  it('Can commit diff | [0] ==> [1,1]', () => {
    const
    changes = diff(BZ, BOO),
    committed = commit(BZ, ... changes);

    expect(committed).to.deep.eq(BOO);
  });

  it('Can commit diff | [0,0] ==> [1,1]', () => {
    const
    changes = diff(BZZ, BOO),
    committed = commit(BZZ, ... changes);

    expect(committed).to.deep.eq(BOO);
  });

  it('Can commit diff | [0,0] ==> [0,0,1]', () => {
    const
    changes = diff(BZZ, BZZO),
    committed = commit(BZZ, ... changes);

    expect(committed).to.deep.eq(BZZO);
  });

  it('Can commit diff | [0,0,1] ==> [0,0]', () => {
    const
    changes = diff(BZZO, BZZ),
    committed = commit(BZZO, ... changes);

    expect(committed).to.deep.eq(BZZ);
  });

  it('Can commit diff | [1,1,0,1] ==> [0,1,0]', () => {
    const
    changes = diff(BOOZO, BZOZ),
    committed = commit(BOOZO, ... changes);

    expect(committed).to.deep.eq(BZOZ);
  });

  it('Can commit diff | [1,1,1,0,1,0,0,1] ==> [0,0,1,1,1,0,1]', () => {
    const
    changes = diff(BOOOZOZZO,BZZOOOZO),
    committed = commit(BOOOZOZZO, ... changes);

    expect(committed).to.deep.eq(BZZOOOZO);
  });
});

describe('revert', () => {
  it('Can revert diff | [0] ==> []', () => {
    const
    changes = diff(BZ, B),
    committed = commit(BZ, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(B);
    expect(reverted).to.deep.eq(BZ);
  });

  it('Can revert diff | [] ==> [0]', () => {
    const
    changes = diff(B, BZ),
    committed = commit(B, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BZ);
    expect(reverted).to.deep.eq(B);
  });

  it('Can revert diff | [0] ==> [1]', () => {
    const
    changes = diff(BZ, BO),
    committed = commit(BZ, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BO);
    expect(reverted).to.deep.eq(BZ);
  });

  it('Can revert diff | [0,0] ==> [0,1]', () => {
    const
    changes = diff(BZZ,BZO),
    committed = commit(BZZ, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BZO);
    expect(reverted).to.deep.eq(BZZ);
  });

  it('Can revert diff | [0,0] ==> [1]', () => {
    const
    changes = diff(BZZ, BO),
    committed = commit(BZZ, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BO);
    expect(reverted).to.deep.eq(BZZ);
  });

  it('Can revert diff | [0] ==> [1,1]', () => {
    const
    changes = diff(BZ, BOO),
    committed = commit(BZ, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BOO);
    expect(reverted).to.deep.eq(BZ);
  });

  it('Can revert diff | [0,0] ==> [1,1]', () => {
    const
    changes = diff(BZZ, BOO),
    committed = commit(BZZ, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BOO);
    expect(reverted).to.deep.eq(BZZ);
  });

  it('Can revert diff | [0,0] ==> [0,0,1]', () => {
    const
    changes = diff(BZZ, BZZO),
    committed = commit(BZZ, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BZZO);
    expect(reverted).to.deep.eq(BZZ);
  });

  it('Can revert diff | [0,0,1] ==> [0,0]', () => {
    const
    changes = diff(BZZO, BZZ),
    committed = commit(BZZO, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BZZ);
    expect(reverted).to.deep.eq(BZZO);
  });

  it('Can revert diff | [1,1,0,1] ==> [0,1,0]', () => {
    const
    changes = diff(BOOZO, BZOZ),
    committed = commit(BOOZO, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BZOZ);
    expect(reverted).to.deep.eq(BOOZO);
  });

  it('Can revert diff | [1,1,1,0,1,0,0,1] ==> [0,0,1,1,1,0,1]', () => {
    const
    changes = diff(BOOOZOZZO,BZZOOOZO),
    committed = commit(BOOOZOZZO, ... changes),
    reverted = revert(committed, ... changes);

    expect(committed).to.deep.eq(BZZOOOZO);
    expect(reverted).to.deep.eq(BOOOZOZZO);
  });
});

describe('diff + commit + revert', () => {

  const it2 = (a: string, b: string, encoding ?: string) => { // , gramLength ?: number, lookAheadMax ?: number
    it(`process A(${a}) into B(${b}) and back`, () => { //  (grams: ${gramLength}, lookAhead: ${lookAheadMax})
      const
      bufferA = Buffer.from(a, encoding),
      bufferB = Buffer.from(b, encoding),
      theDiff   = diff(bufferA, bufferB), // , gramLength, lookAheadMax
      theCommit = commit(bufferA, ... theDiff),
      theRevert = revert(theCommit, ... theDiff);

      // console.log(theDiff.map((d,di) => `index: ${d.index}, left: ${d.left.toString(encoding)}, right: ${d.right.toString(encoding)}`).join('\n'));
      // console.log('committed (%s), reverted (%s)', theCommit.toString(encoding), theRevert.toString(encoding));

      expect(theCommit.toString(encoding)).to.eq(b);
      expect(theRevert.toString(encoding)).to.eq(a);
    });
  };

  it2('strawberry','raspberry');
  it2('strawberry','blackberry');
  it2('strawberry','kiwi');
  it2('strawberry','orange');
  it2('strawberry','mango');
  it2('strawberry','coconut');
  it2('strawberry','banana');
  it2('strawberry','pineapple');
  it2('strawberry','grape');
  it2('abcdefghi' ,'jklmnop');
  it2('the quick brown fox','the slow yellow chicken');
  it2(
    `Bacon ipsum dolor amet landjaeger pork loin pastrami ball tip tri-tip kevin chuck beef ribs chicken porchetta rump. Filet mignon ground round pig shank. Rump ball tip alcatra meatball frankfurter landjaeger. Shank swine meatloaf, pancetta leberkas ham hock short loin shoulder. Meatloaf spare ribs ham capicola tongue, picanha turducken fatback pig salami bacon hamburger ham hock.`,
    `Pork belly kevin tenderloin frankfurter, prosciutto salami jowl beef ribs. Ribeye boudin ground round bresaola turducken leberkas burgdoggen. Turducken tri-tip pork loin ball tip pastrami chuck pig tongue ham frankfurter meatball chicken beef swine shank. Salami pancetta capicola boudin fatback landjaeger filet mignon.`
  );

});
