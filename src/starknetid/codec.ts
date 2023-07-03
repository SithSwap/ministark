import { trimEnd } from '../utilities/string.js';
import { Delimiter, Alphabet, Star } from './alphabet.js';

function extract(input: string): [string, number] {
	const output = trimEnd(input, Star);
	return [output, input.length - output.length];
}

export function decode(encoded: bigint[]): string {
	let decoded = '';

	for (let subdomain of encoded) {
		while (subdomain !== 0n) {
			const code = subdomain % Alphabet.Basic.SizePlusOne;
			subdomain /= Alphabet.Basic.SizePlusOne;
			if (code === Alphabet.Basic.Size) {
				const next = subdomain / Alphabet.Big.SizePlusOne;
				if (next === 0n) {
					const code = subdomain % Alphabet.Big.SizePlusOne;
					subdomain = next;
					if (code === 0n) decoded += Alphabet.Basic.Characters[0];
					else decoded += Alphabet.Big.Characters[Number(code) - 1];
				} else {
					const code = subdomain % Alphabet.Big.Size;
					decoded += Alphabet.Big.Characters[Number(code)];
					subdomain /= Alphabet.Big.Size;
				}
			} else {
				decoded += Alphabet.Basic.Characters[Number(code)];
			}
		}

		const [extracted, k] = extract(decoded);

		if (k) {
			decoded = extracted;
			decoded +=
				k % 2 === 0 ? Star.repeat(k / 2 - 1) + Delimiter : Star.repeat((k - 1) / 2 + 1);
		}
		decoded += '.';
	}

	return decoded ? `${decoded}stark` : decoded;
}

export function encode(decoded: string): bigint {
	let encoded = 0n;
	let multiplier = 1n;

	if (decoded.endsWith(Delimiter)) {
		const [extracted, k] = extract(decoded.substring(0, decoded.length - 2));
		decoded = extracted + Star.repeat(2 * (k + 1));
	} else {
		const [extracted, k] = extract(decoded);
		if (k) decoded = extracted + Star.repeat(1 + 2 * (k - 1));
	}

	for (let i = 0; i < decoded.length; i += 1) {
		const char = decoded[i];
		const index = Alphabet.Basic.LUT[char];

		if (index !== undefined) {
			if (i === decoded.length - 1 && decoded[i] === Alphabet.Basic.Characters[0]) {
				encoded += multiplier * Alphabet.Basic.Size;
				multiplier *= Alphabet.Basic.SizePlusOne;
			} else {
				encoded += multiplier * BigInt(Alphabet.Basic.LUT[char]);
			}
			multiplier *= Alphabet.Basic.SizePlusOne;
		} else {
			const index = Alphabet.Big.LUT[char];
			if (index === undefined) continue;

			encoded += multiplier * Alphabet.Basic.Size;
			multiplier *= Alphabet.Basic.SizePlusOne;
			encoded += multiplier * BigInt((i === decoded.length - 1 ? 1 : 0) + index);
			multiplier *= Alphabet.Big.Size;
		}
	}
	return encoded;
}
