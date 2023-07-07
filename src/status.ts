import { Info } from './network.js';
import { TimeoutController } from './utilities/promise.js';

export const enum Status {
	Ok = 'ok',
	Degraded = 'degraded',
	Error = 'error',
	Unknown = 'unknown'
}

async function checkly({ chain }: Info): Promise<Enumerate<Status>> {
	if (chain !== Network.ChainID.Goerli) return Status.Unknown;

	try {
		const controller = new TimeoutController(8000);
		const url = 'https://starknet-status.vercel.app/api/simple-status';
		const response = await fetch(url, { signal: controller.signal });
		controller.clear();
		const { status } = await response.json();
		return response.status === 200 ? status : Status.Error;
	} catch {
		return Status.Error;
	}
}

const enum Gateway {
	Default = 'gateway',
	Feeder = 'feeder_gateway'
}

async function gateway(name: Enumerate<Gateway>, { base }: Info): Promise<Enumerate<Status>> {
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

type Checker = (network: Info) => Promise<Enumerate<Status>>;

async function check(checkers: Checker[], network: Info): Promise<Enumerate<Status>> {
	const statuses = await Promise.all(checkers.map(checker => checker(network)));

	let status: Status = Status.Unknown;
	for (const current of statuses) {
		if (current === Status.Error || current === Status.Degraded) return current;
		if (current === Status.Ok) status = Status.Ok;
	}

	return status;
}

export const status = check.bind(null, [
	checkly,
	gateway.bind(null, Gateway.Feeder),
	gateway.bind(null, Gateway.Default)
]);
