/// <reference types="node" />
/**
* Interface for a buffer change.
*/
export interface IBufferChange {
    index: number;
    left: Buffer;
    right: Buffer;
}
/**
* Resize a buffer from a certain position with a certain delta. If adding new space,
* provides option to fill with a certain value.
*/
export declare function resize(buffer: Buffer, index: number, delta: number, fillWith?: number): Buffer;
/**
* Latest generation diff algorithm. Compares buffer A with buffer B and computes
* all changes needed to convert A into B (done with commit function).
*/
export declare function diff(a: Buffer, b: Buffer): IBufferChange[];
/**
* Determines if a change is possible on target or not.
*/
export declare function canCommit(target: Buffer, change: IBufferChange): boolean;
/**
* Determines if a change can be reverted from target.
*/
export declare function canRevert(target: Buffer, change: IBufferChange): boolean;
/**
* Latest generation commit algorithm. Takes all changes provided and applies them
* to the target provided. If change does not line up with target exactly, it will throw
* an error.
*/
export declare function commit(target: Buffer, ...changes: IBufferChange[]): Buffer;
/**
* Latest generation revert algorithm. Takes all changes provided and does the reverse
* of the commit function to target.
*/
export declare function revert(target: Buffer, ...changes: IBufferChange[]): Buffer;
