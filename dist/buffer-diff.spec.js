"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const buffer_diff_1 = require("./buffer-diff");
const B = new Buffer([]), BZ = new Buffer([0]), BO = new Buffer([1]), BZZ = new Buffer([0, 0]), BZO = new Buffer([0, 1]), BOO = new Buffer([1, 1]), BOZZ = new Buffer([1, 0, 0]), BZOZ = new Buffer([0, 1, 0]), BZZO = new Buffer([0, 0, 1]), BOOZO = new Buffer([1, 1, 0, 1]), BZZOOOZO = new Buffer([0, 0, 1, 1, 1, 0, 1]), BOOOZOZZO = new Buffer([1, 1, 1, 0, 1, 0, 0, 1]);
describe('diff', () => {
    it('Can calculate diff | [0] ==> []', () => {
        const changes = buffer_diff_1.diff(BZ, B);
        chai_1.expect(changes.length).to.eq(1);
        chai_1.expect(changes[0].index).to.eq(0);
        chai_1.expect(changes[0].left).to.deep.eq(BZ);
        chai_1.expect(changes[0].right).to.deep.eq(B);
    });
    it('Can calculate diff | [] ==> [0]', () => {
        const changes = buffer_diff_1.diff(B, BZ);
        chai_1.expect(changes.length).to.eq(1);
        chai_1.expect(changes[0].index).to.eq(0);
        chai_1.expect(changes[0].left).to.deep.eq(B);
        chai_1.expect(changes[0].right).to.deep.eq(BZ);
    });
    it('Can calculate diff | [0] ==> [1]', () => {
        const changes = buffer_diff_1.diff(BZ, BO);
        chai_1.expect(changes.length).to.eq(1);
        chai_1.expect(changes[0].index).to.eq(0);
        chai_1.expect(changes[0].left).to.deep.eq(BZ);
        chai_1.expect(changes[0].right).to.deep.eq(BO);
    });
    it('Can calculate diff | [0,0] ==> [0,1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BZO);
        chai_1.expect(changes.length).to.eq(1);
        chai_1.expect(changes[0].index).to.eq(1);
        chai_1.expect(changes[0].left).to.deep.eq(BZ);
        chai_1.expect(changes[0].right).to.deep.eq(BO);
    });
    it('Can calculate diff | [0,0] ==> [1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BO);
        chai_1.expect(changes.length).to.eq(1);
        chai_1.expect(changes[0].index).to.eq(0);
        chai_1.expect(changes[0].left).to.deep.eq(BZZ);
        chai_1.expect(changes[0].right).to.deep.eq(BO);
    });
    it('Can calculate diff | [0] ==> [1,1]', () => {
        const changes = buffer_diff_1.diff(BZ, BOO);
        chai_1.expect(changes.length).to.eq(1);
        chai_1.expect(changes[0].index).to.eq(0);
        chai_1.expect(changes[0].left).to.deep.eq(BZ);
        chai_1.expect(changes[0].right).to.deep.eq(BOO);
    });
    it('Can calculate diff | [0,0] ==> [1,1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BOO);
        chai_1.expect(changes.length).to.eq(1);
        chai_1.expect(changes[0].index).to.eq(0);
        chai_1.expect(changes[0].left).to.deep.eq(BZZ);
        chai_1.expect(changes[0].right).to.deep.eq(BOO);
    });
    it('Can calculate diff | [0,0] ==> [0,0,1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BZZO);
        chai_1.expect(changes.length).to.eq(1);
        chai_1.expect(changes[0].index).to.eq(2);
        chai_1.expect(changes[0].left).to.deep.eq(B);
        chai_1.expect(changes[0].right).to.deep.eq(BO);
    });
    it('Can calculate diff | [0,0,1] ==> [0,0]', () => {
        const changes = buffer_diff_1.diff(BZZO, BZZ);
        chai_1.expect(changes.length).to.eq(1);
        chai_1.expect(changes[0].index).to.eq(2);
        chai_1.expect(changes[0].left).to.deep.eq(BO);
        chai_1.expect(changes[0].right).to.deep.eq(B);
    });
    it('Can calculate diff | [1,1,0,1] ==> [0,1,0]', () => {
        const changes = buffer_diff_1.diff(BOOZO, BZOZ);
        chai_1.expect(changes.length).to.eq(3);
        chai_1.expect(changes[0].index).to.eq(0);
        chai_1.expect(changes[0].left).to.deep.eq(B);
        chai_1.expect(changes[0].right).to.deep.eq(BZ);
        chai_1.expect(changes[1].index).to.eq(2);
        chai_1.expect(changes[1].left).to.deep.eq(BO);
        chai_1.expect(changes[1].right).to.deep.eq(B);
        chai_1.expect(changes[2].index).to.eq(3);
        chai_1.expect(changes[2].left).to.deep.eq(BO);
        chai_1.expect(changes[2].right).to.deep.eq(B);
    });
    it('Can calculate diff | [1,1,1,0,1,0,0,1] ==> [0,0,1,1,1,0,1]', () => {
        const changes = buffer_diff_1.diff(BOOOZOZZO, BZZOOOZO);
        chai_1.expect(changes.length).to.eq(2);
        chai_1.expect(changes[0].index).to.eq(0);
        chai_1.expect(changes[0].left).to.deep.eq(B);
        chai_1.expect(changes[0].right).to.deep.eq(BZZ);
        chai_1.expect(changes[1].index).to.eq(7);
        chai_1.expect(changes[1].left).to.deep.eq(BZZO);
        chai_1.expect(changes[1].right).to.deep.eq(B);
    });
});
describe('canCommit', () => {
    it('can commit a simple test', () => {
        const target = new Buffer([0, 1, 2, 3, 4]), change = { index: 0, left: new Buffer([0, 1, 2]), right: Buffer.allocUnsafe(0) };
        chai_1.expect(buffer_diff_1.canCommit(target, change));
    });
    // TODO: i'll add more test cases later
});
describe('canRevert', () => {
    it('can revert a simple test', () => {
        const target = new Buffer([2, 1, 0, 3, 4]), change = { index: 0, left: new Buffer([0, 1, 2]), right: Buffer.allocUnsafe(0) };
        chai_1.expect(buffer_diff_1.canRevert(target, change));
    });
    // TODO: i'll add more test cases later
});
describe('commit', () => {
    it('Can commit diff | [0] ==> []', () => {
        const changes = buffer_diff_1.diff(BZ, B), committed = buffer_diff_1.commit(BZ, ...changes);
        chai_1.expect(committed).to.deep.eq(B);
    });
    it('Can commit diff | [] ==> [0]', () => {
        const changes = buffer_diff_1.diff(B, BZ), committed = buffer_diff_1.commit(B, ...changes);
        chai_1.expect(committed).to.deep.eq(BZ);
    });
    it('Can commit diff | [0] ==> [1]', () => {
        const changes = buffer_diff_1.diff(BZ, BO), committed = buffer_diff_1.commit(BZ, ...changes);
        chai_1.expect(committed).to.deep.eq(BO);
    });
    it('Can commit diff | [0,0] ==> [0,1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BZO), committed = buffer_diff_1.commit(BZZ, ...changes);
        chai_1.expect(committed).to.deep.eq(BZO);
    });
    it('Can commit diff | [0,0] ==> [1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BO), committed = buffer_diff_1.commit(BZZ, ...changes);
        chai_1.expect(committed).to.deep.eq(BO);
    });
    it('Can commit diff | [0] ==> [1,1]', () => {
        const changes = buffer_diff_1.diff(BZ, BOO), committed = buffer_diff_1.commit(BZ, ...changes);
        chai_1.expect(committed).to.deep.eq(BOO);
    });
    it('Can commit diff | [0,0] ==> [1,1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BOO), committed = buffer_diff_1.commit(BZZ, ...changes);
        chai_1.expect(committed).to.deep.eq(BOO);
    });
    it('Can commit diff | [0,0] ==> [0,0,1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BZZO), committed = buffer_diff_1.commit(BZZ, ...changes);
        chai_1.expect(committed).to.deep.eq(BZZO);
    });
    it('Can commit diff | [0,0,1] ==> [0,0]', () => {
        const changes = buffer_diff_1.diff(BZZO, BZZ), committed = buffer_diff_1.commit(BZZO, ...changes);
        chai_1.expect(committed).to.deep.eq(BZZ);
    });
    it('Can commit diff | [1,1,0,1] ==> [0,1,0]', () => {
        const changes = buffer_diff_1.diff(BOOZO, BZOZ), committed = buffer_diff_1.commit(BOOZO, ...changes);
        chai_1.expect(committed).to.deep.eq(BZOZ);
    });
    it('Can commit diff | [1,1,1,0,1,0,0,1] ==> [0,0,1,1,1,0,1]', () => {
        const changes = buffer_diff_1.diff(BOOOZOZZO, BZZOOOZO), committed = buffer_diff_1.commit(BOOOZOZZO, ...changes);
        chai_1.expect(committed).to.deep.eq(BZZOOOZO);
    });
});
describe('revert', () => {
    it('Can revert diff | [0] ==> []', () => {
        const changes = buffer_diff_1.diff(BZ, B), committed = buffer_diff_1.commit(BZ, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(B);
        chai_1.expect(reverted).to.deep.eq(BZ);
    });
    it('Can revert diff | [] ==> [0]', () => {
        const changes = buffer_diff_1.diff(B, BZ), committed = buffer_diff_1.commit(B, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BZ);
        chai_1.expect(reverted).to.deep.eq(B);
    });
    it('Can revert diff | [0] ==> [1]', () => {
        const changes = buffer_diff_1.diff(BZ, BO), committed = buffer_diff_1.commit(BZ, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BO);
        chai_1.expect(reverted).to.deep.eq(BZ);
    });
    it('Can revert diff | [0,0] ==> [0,1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BZO), committed = buffer_diff_1.commit(BZZ, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BZO);
        chai_1.expect(reverted).to.deep.eq(BZZ);
    });
    it('Can revert diff | [0,0] ==> [1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BO), committed = buffer_diff_1.commit(BZZ, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BO);
        chai_1.expect(reverted).to.deep.eq(BZZ);
    });
    it('Can revert diff | [0] ==> [1,1]', () => {
        const changes = buffer_diff_1.diff(BZ, BOO), committed = buffer_diff_1.commit(BZ, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BOO);
        chai_1.expect(reverted).to.deep.eq(BZ);
    });
    it('Can revert diff | [0,0] ==> [1,1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BOO), committed = buffer_diff_1.commit(BZZ, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BOO);
        chai_1.expect(reverted).to.deep.eq(BZZ);
    });
    it('Can revert diff | [0,0] ==> [0,0,1]', () => {
        const changes = buffer_diff_1.diff(BZZ, BZZO), committed = buffer_diff_1.commit(BZZ, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BZZO);
        chai_1.expect(reverted).to.deep.eq(BZZ);
    });
    it('Can revert diff | [0,0,1] ==> [0,0]', () => {
        const changes = buffer_diff_1.diff(BZZO, BZZ), committed = buffer_diff_1.commit(BZZO, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BZZ);
        chai_1.expect(reverted).to.deep.eq(BZZO);
    });
    it('Can revert diff | [1,1,0,1] ==> [0,1,0]', () => {
        const changes = buffer_diff_1.diff(BOOZO, BZOZ), committed = buffer_diff_1.commit(BOOZO, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BZOZ);
        chai_1.expect(reverted).to.deep.eq(BOOZO);
    });
    it('Can revert diff | [1,1,1,0,1,0,0,1] ==> [0,0,1,1,1,0,1]', () => {
        const changes = buffer_diff_1.diff(BOOOZOZZO, BZZOOOZO), committed = buffer_diff_1.commit(BOOOZOZZO, ...changes), reverted = buffer_diff_1.revert(committed, ...changes);
        chai_1.expect(committed).to.deep.eq(BZZOOOZO);
        chai_1.expect(reverted).to.deep.eq(BOOOZOZZO);
    });
});
describe('diff + commit + revert', () => {
    const it2 = (a, b, encoding) => {
        it(`process A(${a}) into B(${b}) and back`, () => {
            const bufferA = Buffer.from(a, encoding), bufferB = Buffer.from(b, encoding), theDiff = buffer_diff_1.diff(bufferA, bufferB), // , gramLength, lookAheadMax
            theCommit = buffer_diff_1.commit(bufferA, ...theDiff), theRevert = buffer_diff_1.revert(theCommit, ...theDiff);
            // console.log(theDiff.map((d,di) => `index: ${d.index}, left: ${d.left.toString(encoding)}, right: ${d.right.toString(encoding)}`).join('\n'));
            // console.log('committed (%s), reverted (%s)', theCommit.toString(encoding), theRevert.toString(encoding));
            chai_1.expect(theCommit.toString(encoding)).to.eq(b);
            chai_1.expect(theRevert.toString(encoding)).to.eq(a);
        });
    };
    it2('strawberry', 'raspberry');
    it2('strawberry', 'blackberry');
    it2('strawberry', 'kiwi');
    it2('strawberry', 'orange');
    it2('strawberry', 'mango');
    it2('strawberry', 'coconut');
    it2('strawberry', 'banana');
    it2('strawberry', 'pineapple');
    it2('strawberry', 'grape');
    it2('abcdefghi', 'jklmnop');
    it2('the quick brown fox', 'the slow yellow chicken');
    it2(`Bacon ipsum dolor amet landjaeger pork loin pastrami ball tip tri-tip kevin chuck beef ribs chicken porchetta rump. Filet mignon ground round pig shank. Rump ball tip alcatra meatball frankfurter landjaeger. Shank swine meatloaf, pancetta leberkas ham hock short loin shoulder. Meatloaf spare ribs ham capicola tongue, picanha turducken fatback pig salami bacon hamburger ham hock.`, `Pork belly kevin tenderloin frankfurter, prosciutto salami jowl beef ribs. Ribeye boudin ground round bresaola turducken leberkas burgdoggen. Turducken tri-tip pork loin ball tip pastrami chuck pig tongue ham frankfurter meatball chicken beef swine shank. Salami pancetta capicola boudin fatback landjaeger filet mignon.`);
});
//# sourceMappingURL=buffer-diff.spec.js.map