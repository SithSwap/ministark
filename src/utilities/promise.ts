export function sleep(delay: number) {
	return new Promise<void>(resolve => setTimeout(resolve, delay));
}

export class TimeoutController extends AbortController {
	#timer: ReturnType<typeof setTimeout>;

	constructor(delay: number) {
		super();
		this.#timer = setTimeout(this.abort.bind(this, new Error('Timeout')), delay);
	}

	clear() {
		clearTimeout(this.#timer);
	}
}
