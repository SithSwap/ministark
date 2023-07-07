import type { Provider } from 'starknet';
import { sleep } from './utilities/promise.js';

export function get(provider: Provider, hash: HexString) {
	return provider.getTransaction(hash);
}

type WaitOptions = {
	interval?: number;
	retries?: number;
	pass?: Enumerate<Transaction.Status>[];
	reject?: Enumerate<Transaction.Status>[];
};

export class Timeout extends Error {
	constructor(after: number) {
		super(`timed-out after ${after} attempts`);
		this.name = 'Timeout';
	}
}

export class Rejected extends Error {
	status: string;
	constructor(status: Enumerate<Transaction.Status>) {
		super(`transaction failed with status ${status}`);
		this.name = 'Rejected';
		this.status = status;
	}
}

export async function wait(provider: Provider, hash: HexString, options?: WaitOptions) {
	const { interval, retries, pass, reject } = {
		interval: 8000,
		retries: 10,
		pass: [Transaction.Status.Pending, Transaction.Status.AcceptedOnL2, Transaction.Status.AcceptedOnL1],
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
