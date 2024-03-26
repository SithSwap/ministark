import type { Enumerate, ValuesOf } from '$src/types.js';
import type { Info as NetworkInfo } from './network.js';

import { TimeoutController } from '$src/utilities/promise.js';

export const Status = Object.freeze({
	Ok: 'ok',
	Degraded: 'degraded',
	Error: 'error',
	Unknown: 'unknown'
});

export type Status = ValuesOf<typeof Status>;

const enum Gateway {
	Default = 'gateway',
	Feeder = 'feeder_gateway'
}

async function gateway(name: Enumerate<Gateway>, { base }: NetworkInfo): Promise<Status> {
	try {
		const url = new URL(`${name}/is_alive`, base);
		const controller = new TimeoutController(5000);
		const response = await fetch(url, { signal: controller.signal });
		controller.clear();
		if (response.status === 200) return Status.Ok;
		if (response.status === 429) return Status.Degraded;
		return Status.Error;
	} catch {
		return Status.Error;
	}
}

type Checker = (network: NetworkInfo) => Promise<Status>;

async function check(checkers: Checker[], network: NetworkInfo): Promise<Status> {
	const statuses = await Promise.all(checkers.map(checker => checker(network)));

	let status: Status = Status.Unknown;
	for (const current of statuses) {
		if (current === Status.Error || current === Status.Degraded) return current;
		if (current === Status.Ok) status = Status.Ok;
	}

	return status;
}

export const status = check.bind(null, [
	gateway.bind(null, Gateway.Feeder),
	gateway.bind(null, Gateway.Default)
]);
