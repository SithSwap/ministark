import { toLUT } from '../utilities/string';

type Alphabet<D extends Record<string, string>> = {
	[K in keyof D]: {
		Characters: D[K];
		Size: bigint;
		SizePlusOne: bigint;
		LUT: Record<string, number>;
	};
};

function from<D extends Record<string, string>>(dictionary: D) {
	const Alphabet = {} as Alphabet<D>;
	for (const [type, characters] of Object.entries(dictionary) as Entries<D>) {
		const size = BigInt(characters.length);
		Alphabet[type] = {
			Characters: characters,
			Size: size,
			SizePlusOne: size + 1n,
			LUT: toLUT(characters)
		};
	}

	return Alphabet;
}

export const Alphabet = from({
	Basic: 'abcdefghijklmnopqrstuvwxyz0123456789-',
	Big: '这来'
} as const);

export const Star = Alphabet.Big.Characters[Alphabet.Big.Characters.length - 1];
export const Delimiter = Alphabet.Big.Characters[0] + Alphabet.Basic.Characters[1];
