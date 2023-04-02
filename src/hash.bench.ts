import { pedersen } from './hash';
import { hash } from 'starknet';
import { bench } from 'vitest';

describe('pedersen', () => {
	const input = [
		[1, 2],
		['0x123213123', '0x0fe2123c'],
		['0x12773', '0x872362'],
		['0x79dc0da7c54b95f10aa182ad0a46400db63156920adb65eca2654c0945a463', 34234324]
	];

	bench('starknet.js', () => {
		for (let i = 0; i < input.length; i++) {
			const [a, b] = input[i];
			hash.pedersen([a, b]);
		}
	});

	bench('ministark', () => {
		for (let i = 0; i < input.length; i++) {
			const [a, b] = input[i];
			pedersen(a, b);
		}
	});
});
