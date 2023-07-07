import type { Provider } from 'starknet';
import { sleep } from './utilities/promise.js';

export const HashPrefix = Object.freeze({
	Declare: '0x6465636c617265', // toShortString('declare')
	Deploy: '0x6465706c6f79', // toShortString('deploy')
	Invoke: '0x696e766f6b65', // toShortString('invoke')
	L1Handler: '0x6c315f68616e646c6572' // toShortString('l1_handler')
});
export type HashPrefix = ValuesOf<typeof HashPrefix>;

export const Status = Object.freeze({
	NotReceived: 'NOT_RECEIVED',
	Received: 'RECEIVED',
	Pending: 'PENDING',
	AcceptedOnL2: 'ACCEPTED_ON_L2',
	AcceptedOnL1: 'ACCEPTED_ON_L1',
	Rejected: 'REJECTED'
});
export type Status = ValuesOf<typeof Status>;

export const Type = Object.freeze({
	Declare: 'DECLARE',
	Deploy: 'DEPLOY',
	Invoke: 'INVOKE',
	L1Handler: 'L1_HANDLER',
	DeployAccount: 'DEPLOY_ACCOUNT',
	InvokeFunction: 'INVOKE_FUNCTION'
} as const);
export type Type = ValuesOf<typeof Type>;

export function get(provider: Provider, hash: HexString) {
	return provider.getTransaction(hash);
}

type WaitOptions = {
	interval?: number;
	retries?: number;
	pass?: Status[];
	reject?: Status[];
};

export class Timeout extends Error {
	constructor(after: number) {
		super(`timed-out after ${after} attempts`);
		this.name = 'Timeout';
	}
}

export class Rejected extends Error {
	status: string;
	constructor(status: Status) {
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
