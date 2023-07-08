// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback<A extends unknown[] = never[], R = any> = (...args: A) => R;

export function debounce<F extends Callback>(fn: F, wait = 100) {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return (...args: Parameters<F>) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => fn(...args), wait);
	};
}
