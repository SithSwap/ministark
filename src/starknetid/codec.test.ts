import { withSeed } from '$tests/utilities/random.js';
import { decode, encode } from './codec.js';

function generate(length: number, seed: number) {
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789-这来';
	let result = '';
	while (length--) result += characters[Math.floor(withSeed(seed) * characters.length)];
	return result;
}

describe.concurrent('starknetid: codec', () => {
	test('encode and decode an empty string', () => {
		expect(encode('')).toBe(0n);
	});

	test('encode and decode a number', () => {
		for (let i = 0; i < 2500; i++) {
			const decoded = decode([BigInt(i)]);
			const encoded = encode(decoded.substring(0, decoded.length - 6));
			expect(encoded.toString()).toBe(i.toString());
		}
	});

	test('encode and decode with a random string [%s]', () => {
		for (let i = 0; i < 2500; i++) {
			const target = generate(10, i);
			expect(decode([encode(target)])).toBe(`${target}.stark`);
		}
	});
});
