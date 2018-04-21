# js-buffer-diff
Typescript utility functions to create, commit and revert a diff of two buffer objects.

While I add more docs here, take a look at the unit test cases in src/*.spec.ts.

This module is still in development, so please don't use in a production environment yet.


#### Example Usage:

```typescript
import { diff, commit, revert } from 'js-buffer-diff';

const
bufferA = new Buffer([83,29,19,49,59,20,1,49,95,30,99,33,19,92,5,11,129,95,28,94,205]),
bufferB = new Buffer([83,29,21,4,72,9,20,1,49,95,36,99,33,19,92,25,5,11,95,28,94,225]);

const changes = diff(bufferA, bufferB);

console.log('changes:', changes);

const committed = commit(bufferA, ... changes);   // committed should eq bufferB

console.log('committed:', committed, committed.equals(bufferB));

const reverted  = revert(committed, ... changes); // reverted should eq bufferA

console.log('reverted:', reverted, reverted.equals(bufferA));
```
