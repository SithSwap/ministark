import { keccak_256 } from '@noble/hashes/sha3';
import { toBigInt } from './utilities/buffer';
import { toShortString } from './codec';
import { Points, FieldPrime, Precomputed } from './curve';

const ENCODER = new TextEncoder();

// const Mask251 = 2n ** 251n;
const Mask250 = 2n ** 250n - 1n;

/**
 * Function to get the starknet keccak hash from a string
 *
 * [Reference](https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/starknet/public/abi.py#L17-L22)
 * @param value - string you want to get the starknetKeccak hash from
 * @returns starknet keccak hash as bigint
 */
export function keccak(value: string) {
	return toBigInt(keccak_256(ENCODER.encode(value))) & Mask250;
}

/**
 * Function to get the hex selector from a given function name
 *
 * [Reference](https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/starknet/public/abi.py#L25-L26)
 * @param name - selectors abi function name
 * @returns hex selector of given abi function name
 */
export function selectorFor(name: string): HexString {
	return `0x${keccak(name).toString(16)}`;
}

const PREFIX = toShortString('STARKNET_CONTRACT_ADDRESS').toString();

export function pedersen(x: BigIntish, y: BigIntish) {
	let point = Points[0];
	const values = [x, y];
	for (let i = 0; i < 2; i++) {
		let value = BigInt(values[i]);
		if (value < 0n || value >= FieldPrime) throw new Error(`Invalid input: ${value}`);
		for (let j = 0; j < 252; j++) {
			const current = Precomputed[i][j];
			if (current.equals(point)) throw new Error('Same point');
			if ((value & 1n) !== 0n) point = point.add(current);
			value >>= 1n;
		}
	}
	return point.toAffine().x;
}

export function hash(data: BigIntish[]) {
	data = [...data, data.length];
	let current = 0n;
	for (let i = 0; i < data.length; i++) current = pedersen(current, data[i]);
	return current;
}

export function contract(
	deployer: HexString,
	salt: BigIntish,
	contract: BigIntish,
	calldata: BigIntish[] = []
): HexString {
	return `0x${hash([PREFIX, deployer, salt, contract, hash(calldata)]).toString(16)}`;
}
