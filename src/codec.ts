import type { BigIntish } from '$src/types.js';

import { isASCII } from './utilities/string.js';
import { toBigInt, fromBigInt } from './utilities/buffer.js';

const ShortSrtingMaxLength = 31;

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

export function isShortString(input: string) {
	return input.length <= ShortSrtingMaxLength;
}

export function toShortString(input: string) {
	if (!isASCII(input)) throw new Error(`${input} is not an ASCII string`);
	if (!isShortString(input)) throw new Error(`${input} is too long`);

	return toBigInt(ENCODER.encode(input));
}

export function fromShortString(input: BigIntish) {
	return DECODER.decode(fromBigInt(input));
}

export function toFelt(input: BigIntish): string {
	return BigInt(input).toString();
}
