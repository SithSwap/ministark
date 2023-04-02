import { keccak_256 } from '@noble/hashes/sha3';
import { fromHexString } from './utilities/buffer';

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
	address = normalize(address);
	const chars = address.substring(2).split('');
	const hashed = keccak_256(fromHexString(address as HexString));
	// const hashed = fromHexString(`0x0${pedersen([0, address]).toString(16)}`);
	for (let i = 0; i < chars.length; i += 2) {
		if (hashed[i >> 1] >> 4 >= 8) chars[i] = chars[i].toUpperCase();
		if ((hashed[i >> 1] & 0x0f) >= 8) chars[i + 1] = chars[i + 1].toUpperCase();
	}

	return `0x${chars.join('')}`;
}

export const ZeroAddress = validate('0x0');

export const enum Type {
	Block = 'block',
	Class = 'class',
	Event = 'event',
	Token = 'token',
	Contract = 'contract',
	Transaction = 'transaction'
}
