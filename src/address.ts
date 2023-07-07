import { fromHexString } from './utilities/buffer.js';
import { keccak } from './hash.js';

export function normalize(address: HexString | BigIntish): HexString {
	return `0x${BigInt(address).toString(16).padStart(64, '0')}`;
}

export function validate(address: HexString | BigIntish) {
	try {
		address = normalize(address);
		if (address.length === 66) return address as HexString;
	} catch {
		/* empty */
	}
	return;
}

export function checksum(address: BigIntish) {
	address = BigInt(address).toString(16);

	const chars = address.padStart(64, '0').toLowerCase().split('');
	const hex = keccak(fromHexString(address)).toString(16);
	const hashed = fromHexString(hex.padStart(64, '0'));

	for (let i = 0; i < chars.length; i += 2) {
		if (hashed[i >> 1] >> 4 >= 8) chars[i] = chars[i].toUpperCase();
		if ((hashed[i >> 1] & 15) >= 8) chars[i + 1] = chars[i + 1].toUpperCase();
	}

	return `0x${chars.join('')}`;
}

export const ZeroAddress = validate('0x0');
