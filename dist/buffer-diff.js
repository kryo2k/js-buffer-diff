"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
/**
* Resize a buffer from a certain position with a certain delta. If adding new space,
* provides option to fill with a certain value.
*/
function resize(buffer, index, delta, fillWith = 0) {
    const pieces = [];
    if (delta === 0 || index > buffer.length) // passthru, but ensure a copy is always returned
        pieces.push(buffer);
    else if (delta < 0) // shrink
        pieces.push(buffer.slice(0, index), buffer.slice(index - delta));
    else // grow
        pieces.push(buffer.slice(0, index), new Buffer(new Array(delta).fill(fillWith)), buffer.slice(index));
    return Buffer.concat(pieces);
}
exports.resize = resize;
;
/**
* Latest generation diff algorithm. Compares buffer A with buffer B and computes
* all changes needed to convert A into B (done with commit function).
*/
function diff(a, b) {
    const changes = [];
    if (a.equals(b))
        return changes; // nothing to do
    const lengthA = a.length, lengthB = b.length, push = (index, left, right) => changes.push({ index, left, right });
    let indexA = 0, indexB = 0;
    while ((indexA < lengthA) && (indexB < lengthB)) {
        if (a[indexA] === b[indexB]) {
            indexA++;
            indexB++;
            continue;
        }
        let leftStop = indexA, nextIndexB = -1;
        while (leftStop < lengthA && (nextIndexB = b.indexOf(a[leftStop], indexB)) === -1)
            leftStop++;
        const rightStop = (nextIndexB === -1 ? lengthB : nextIndexB);
        push(indexB, a.slice(indexA, leftStop), b.slice(indexB, rightStop));
        indexA = leftStop;
        indexB = rightStop;
    }
    if (indexA < lengthA)
        push(indexB, a.slice(indexA), Buffer.allocUnsafe(0));
    else if (indexB < lengthB)
        push(indexB, Buffer.allocUnsafe(0), b.slice(indexB));
    return changes;
}
exports.diff = diff;
;
/**
* Determines if a change is possible on target or not.
*/
function canCommit(target, change) {
    const { index, left } = change;
    return target.slice(index, index + left.length).equals(left);
}
exports.canCommit = canCommit;
;
/**
* Determines if a change can be reverted from target.
*/
function canRevert(target, change) {
    const { index, right } = change;
    return target.slice(index, index + right.length).equals(right);
}
exports.canRevert = canRevert;
;
/**
* Latest generation commit algorithm. Takes all changes provided and applies them
* to the target provided. If change does not line up with target exactly, it will throw
* an error.
*/
function commit(target, ...changes) {
    changes.forEach(change => {
        const { index, left, right } = change, lengthDelta = right.length - left.length;
        if (!canCommit(target, change))
            throw new Error('Unable to commit change.');
        target = resize(target, index, lengthDelta);
        right.copy(target, index);
    });
    return target;
}
exports.commit = commit;
;
/**
* Latest generation revert algorithm. Takes all changes provided and does the reverse
* of the commit function to target.
*/
function revert(target, ...changes) {
    const length = changes.length;
    let cursor = length - 1;
    while (cursor > -1) {
        const change = changes[cursor], { index, left, right } = change, lengthDelta = left.length - right.length;
        if (!canRevert(target, change))
            throw new Error('Unable to revert change.');
        target = resize(target, index, lengthDelta);
        left.copy(target, index);
        cursor--;
    }
    return target;
}
exports.revert = revert;
;
//# sourceMappingURL=buffer-diff.js.map