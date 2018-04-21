
/**
* Interface for a buffer change.
*/
export interface IBufferChange {
  index : number;
  left  : Buffer;
  right : Buffer;
};

/**
* Resize a buffer from a certain position with a certain delta. If adding new space,
* provides option to fill with a certain value.
*/
export function resize(buffer: Buffer, index: number, delta : number, fillWith : number = 0) : Buffer {
  const pieces : Buffer[] = [];

  if(delta === 0 || index > buffer.length) // passthru, but ensure a copy is always returned
    pieces.push(buffer);
  else if(delta < 0) // shrink
    pieces.push(
      buffer.slice(0, index),
      buffer.slice(index - delta)
    );
  else // grow
    pieces.push(
      buffer.slice(0, index),
      new Buffer(new Array(delta).fill(fillWith)),
      buffer.slice(index)
    );

  return Buffer.concat(pieces);
};

/**
* Latest generation diff algorithm. Compares buffer A with buffer B and computes
* all changes needed to convert A into B (done with commit function).
*/
export function diff(a : Buffer, b : Buffer) : IBufferChange[] {

  const
  changes : IBufferChange[] = [];

  if(a.equals(b)) return changes; // nothing to do

  const
  lengthA = a.length,
  lengthB = b.length,
  push = (index: number, left: Buffer, right: Buffer) : number => changes.push({ index, left, right });

  let
  indexA : number = 0,
  indexB : number = 0;

  while((indexA < lengthA) && (indexB < lengthB)) {
    if(a[indexA] === b[indexB]) {
      indexA++;
      indexB++;
      continue;
    }

    let
    leftStop   : number = indexA,
    nextIndexB : number = -1;

    while(leftStop < lengthA && (nextIndexB = b.indexOf(a[leftStop], indexB)) === -1)
      leftStop++;

    const rightStop = (nextIndexB === -1 ? lengthB : nextIndexB);

    push(indexB, a.slice(indexA, leftStop), b.slice(indexB, rightStop));

    indexA = leftStop;
    indexB = rightStop;
  }

  if(indexA < lengthA)
    push(indexB, a.slice(indexA), Buffer.allocUnsafe(0));
  else if(indexB < lengthB)
    push(indexB, Buffer.allocUnsafe(0), b.slice(indexB));

  return changes;
};

/**
* Latest generation commit algorithm. Takes all changes provided and applies them
* to the target provided. If change does not line up with target exactly, it will throw
* an error.
*/
export function commit(target : Buffer, ... changes: IBufferChange[]) : Buffer {
  changes.forEach(change => {

    const
    { index, left, right } = change,
    lengthLeft  = left.length,
    lengthRight = right.length,
    lengthDelta = lengthRight - lengthLeft;

    if(!target.slice(index, index + lengthLeft).equals(left))
      throw new Error('Unable to commit change.');

    target = resize(target, index, lengthDelta);
    right.copy(target, index);
  });

  return target;
};

/**
* Latest generation revert algorithm. Takes all changes provided and does the reverse
* of the commit function to target.
*/
export function revert(target : Buffer, ... changes : IBufferChange[]) : Buffer {

  const length = changes.length;
  let cursor : number = length-1;

  while(cursor > -1) {

    const
    { index, left, right } = changes[cursor],
    lengthLeft  = left.length,
    lengthRight = right.length,
    lengthDelta = lengthLeft - lengthRight;

    if(!target.slice(index, index + lengthRight).equals(right))
      throw new Error('Unable to revert change.');

    target = resize(target, index, lengthDelta);
    left.copy(target, index);

    cursor--;
  }

  return target;
};
