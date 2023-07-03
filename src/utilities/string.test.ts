import { toLUT } from './string.js';

describe.concurrent('toLUT', () => {
	test.each([
		['', {}],
		['a', { a: 0 }],
		['abc', { a: 0, b: 1, c: 2 }],
		['abcdefg', { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6 }]
	])('generates lut for string: %s -> %o', (input, expected) => {
		expect(toLUT(input)).toStrictEqual(expected);
	});
});
