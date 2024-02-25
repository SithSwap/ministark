export type HexString = `0x${string}`;
export type BigIntish = bigint | boolean | number | string;
export type Not<T, U> = T extends U ? never : T;
export type Entries<T> = [keyof T, T[keyof T]][];
export type Values<T> = T[keyof T];
export type Arrayable<T> = T | Array<T> | ReadonlyArray<T>;
export type Maybe<T> = T | undefined;
export type Enumerate<E extends string | number> = E extends string
	? `${E}`
	: `${E}` extends `${infer T extends number}`
		? T
		: never;

export type ToRecord<T> = { [K in keyof T]: T[K] };

export type TypedArray =
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

export type ValuesOf<T> = T[keyof T];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Bound<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : F;
