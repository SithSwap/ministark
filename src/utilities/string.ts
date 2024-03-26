export function isASCII(input: string) {
	for (let i = 0; i < input.length; i++) {
		if (input.charCodeAt(i) > 127) return false;
	}
	return true;
}

export function trimEnd(input: string, char: string) {
	let i = input.length;
	while (input[--i] === char);
	return input.substring(0, i + 1);
}

export function toLUT(input: string) {
	const LUT: Record<string, number> = {};
	for (let i = 0; i < input.length; i++) LUT[input[i]] = i;
	return LUT;
}
