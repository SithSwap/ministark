type HexString = `0x${string}`;
type BigIntish = bigint | boolean | number | string;
type Not<T, U> = T extends U ? never : T;
type Entries<T> = [keyof T, T[keyof T]][];
type Values<T> = T[keyof T];
type Arrayable<T> = T | Array<T>;
type Maybe<T> = T | undefined;
type Enumerate<E extends string | number> = E extends string
	? `${E}`
	: `${E}` extends `${infer T extends number}`
	? T
	: never;
type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bound<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : F;
