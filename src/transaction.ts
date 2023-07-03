import type { Provider } from 'starknet';
import { sleep } from './utilities/promise.js';

export const enum HashPrefix {
	// toShortString('declare')
	Declare = '0x6465636c617265',

	// toShortString('deploy')
	Deploy = '0x6465706c6f79',

	// toShortString('invoke')
	Invoke = '0x696e766f6b65',

	// toShortString('l1_handler')
	L1Handler = '0x6c315f68616e646c6572'
}

export const enum Status {
	NotReceived = 'NOT_RECEIVED',
	Received = 'RECEIVED',
	Pending = 'PENDING',
	AcceptedOnL2 = 'ACCEPTED_ON_L2',
	AcceptedOnL1 = 'ACCEPTED_ON_L1',
	Rejected = 'REJECTED'
}

export const enum Type {
	Declare = 'DECLARE',
	Deploy = 'DEPLOY',
	Invoke = 'INVOKE',
	L1Handler = 'L1_HANDLER',
	DeployAccount = 'DEPLOY_ACCOUNT',
	InvokeFunction = 'INVOKE_FUNCTION'
}

export function get(provider: Provider, hash: HexString) {
	return provider.getTransaction(hash);
}

type WaitOptions = {
	interval?: number;
	retries?: number;
	pass?: Enumerate<Status>[];
	reject?: Enumerate<Status>[];
};

export class Timeout extends Error {
	constructor(after: number) {
		super(`timed-out after ${after} attempts`);
		this.name = 'Timeout';
	}
}

export class Rejected extends Error {
	status: string;
	constructor(status: Enumerate<Status>) {
		super(`transaction failed with status ${status}`);
		this.name = 'Rejected';
		this.status = status;
	}
}

export async function wait(provider: Provider, hash: HexString, options?: WaitOptions) {
	const { interval, retries, pass, reject } = {
		interval: 8000,
		retries: 10,
		pass: [Status.Pending, Status.AcceptedOnL2, Status.AcceptedOnL1],
		reject: [],
		...options
	};

	let attempt = retries;
	while (attempt--) {
		try {
			const receipt = await provider.getTransactionReceipt(hash);
			if (!receipt.status) continue;
			if (pass.includes(receipt.status)) return receipt;
			if (reject.includes(receipt.status)) throw new Rejected(receipt.status);
		} catch (e) {
			if (e instanceof Rejected) throw e;
		}
		await sleep(interval);
	}
	throw new Timeout(retries);
}
