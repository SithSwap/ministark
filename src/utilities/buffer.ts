import type { BigIntish, HexString, TypedArray } from '$src/types.js';

const LUT = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));

export function fromHexString(input: string) {
	if (input.startsWith('0x')) input = input.substring(2);
	if (input.length % 2 !== 0) input = '0' + input;

	const bytes = new Uint8Array(input.length / 2);
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(input.substring(i + i, i + i + 2), 16);
	}
	return bytes;
}

export function toHexString(bytes: ArrayLike<number>) {
	const hex = new Array(bytes.length);
	for (let i = 0; i < bytes.length; i++) hex[i] = LUT[bytes[i]];
	return `0x${hex.join('')}` as HexString;
}

export function toBigInt(buffer: ArrayLike<number> | ArrayBuffer | TypedArray | Buffer): bigint {
	let bits = 8n;
	if (ArrayBuffer.isView(buffer)) bits = BigInt(buffer.BYTES_PER_ELEMENT * 8);
	else buffer = new Uint8Array(buffer);

	let output = 0n;
	for (const i of (buffer as TypedArray | Buffer).values()) {
		const bi = BigInt(i);
		output = (output << bits) + bi;
	}
	return output;
}

export function fromBigInt(input: BigIntish) {
	return fromHexString(`0x${BigInt(input).toString(16)}`);
}
