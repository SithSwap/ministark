export function withSeed(seed: number) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}
