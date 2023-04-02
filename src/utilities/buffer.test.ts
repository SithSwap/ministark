import { fromBigInt, toBigInt, fromHexString, toHexString } from './buffer';

describe.concurrent('Buffer BigInt', () => {
	it.each([
		[0n, [0]],
		['0x444149', [0x44, 0x41, 0x49]],
		['1', [0x1]],
		['16', [0x10]],
		[0xdeadbeef, [0xde, 0xad, 0xbe, 0xef]]
	])('converts a bigint [%s] to a buffer [%s]', (input, expected) => {
		expect(fromBigInt(input)).toStrictEqual(Uint8Array.from(expected));
	});

	it.each([
		[[], 0n],
		[[0x44, 0x41, 0x49], '0x444149'],
		[[0x1], '1'],
		[[0x10], '16'],
		[[0xde, 0xad, 0xbe, 0xef], 0xdeadbeef]
	])('converts a buffer [%s] to biginit [%s]', (input, expected) => {
		expect(toBigInt(input)).toStrictEqual(BigInt(expected));
	});
});

describe.concurrent('Buffer HexString', () => {
	it.each([
		['09ff', [9, 255]],
		['05000001', [5, 0, 0, 1]],
		['0', [0]],
		['0x1', [1]]
	])('convert a hexstring [%s] to a buffer [%s]', (input, expected) => {
		expect(fromHexString(input)).toStrictEqual(Uint8Array.from(expected));
	});

	it.each([
		[[9, 255], '09ff'],
		[[5, 0, 0, 1], '05000001'],
		[[0], '0'],
		[[1], '0x1']
	])('convert a buffer [%s] to a hexstring [%s]', (input, expected) => {
		if (!expected.startsWith('0x')) expected = '0x' + expected;
		expect(BigInt(toHexString(input))).toStrictEqual(BigInt(expected));
	});
});
