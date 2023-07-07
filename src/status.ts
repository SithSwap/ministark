import { TimeoutController } from './utilities/promise.js';

async function checkly({ chain }: Network.Info): Promise<Enumerate<Network.Status>> {
	if (chain !== Network.ChainID.Goerli) return Network.Status.Unknown;

	try {
		const controller = new TimeoutController(8000);
		const url = 'https://starknet-status.vercel.app/api/simple-status';
		const response = await fetch(url, { signal: controller.signal });
		controller.clear();
		const { status } = await response.json();
		return response.status === 200 ? status : Network.Status.Error;
	} catch {
		return Network.Status.Error;
	}
}

async function gateway(name: Enumerate<Network.Gateway>, { base }: Network.Info): Promise<Enumerate<Network.Status>> {
	try {
		const url = new URL(`${name}/is_alive`, base);
		const controller = new TimeoutController(5000);
		const response = await fetch(url, { signal: controller.signal });
		controller.clear();
		if (response.status === 200) return Network.Status.Ok;
		if (response.status === 429) return Network.Status.Degraded;
		return Network.Status.Error;
	} catch {
		return Network.Status.Error;
	}
}

type Checker = (network: Network.Info) => Promise<Enumerate<Network.Status>>;

async function check(checkers: Checker[], network: Network.Info): Promise<Enumerate<Network.Status>> {
	const statuses = await Promise.all(checkers.map(checker => checker(network)));

	let status: Network.Status = Network.Status.Unknown;
	for (const current of statuses) {
		if (current === Network.Status.Error || current === Network.Status.Degraded) return current;
		if (current === Network.Status.Ok) status = Network.Status.Ok;
	}

	return status;
}

export const status = check.bind(null, [
	checkly,
	gateway.bind(null, Network.Gateway.Feeder),
	gateway.bind(null, Network.Gateway.Default)
]);
