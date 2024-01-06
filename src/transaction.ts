import type { ProviderInterface } from 'starknet';
import type { HexString, ValuesOf } from '$src/types.js';

import { sleep } from './utilities/promise.js';

export const HashPrefix = Object.freeze({
	Declare: '0x6465636c617265', // toShortString('declare')
	Deploy: '0x6465706c6f79', // toShortString('deploy')
	Invoke: '0x696e766f6b65', // toShortString('invoke')
	L1Handler: '0x6c315f68616e646c6572' // toShortString('l1_handler')
});
export type HashPrefix = ValuesOf<typeof HashPrefix>;

export const ExecutionStatus = Object.freeze({
	Rejected: 'REJECTED',
	Reverted: 'REVERTED',
	Succeeded: 'SUCCEEDED'
});
export type ExecutionStatus = ValuesOf<typeof ExecutionStatus>;

export const FinalityStatus = Object.freeze({
	Received: 'RECEIVED',
	NotReceived: 'NOT_RECEIVED',
	AcceptedOnL2: 'ACCEPTED_ON_L2',
	AcceptedOnL1: 'ACCEPTED_ON_L1'
});
export type FinalityStatus = ValuesOf<typeof FinalityStatus>;
export type Status = ExecutionStatus | FinalityStatus;
export const Type = Object.freeze({
	Declare: 'DECLARE',
	Deploy: 'DEPLOY',
	DeployAccount: 'DEPLOY_ACCOUNT',
	Invoke: 'INVOKE'
});
export type Type = ValuesOf<typeof Type>;

export function get(provider: ProviderInterface, hash: HexString) {
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

const defaultOptions = {
	interval: 8000,
	retries: 10,
	pass: [ExecutionStatus.Succeeded, FinalityStatus.AcceptedOnL2, FinalityStatus.AcceptedOnL1],
	reject: [ExecutionStatus.Rejected, FinalityStatus.NotReceived, ExecutionStatus.Reverted]
};

export async function wait(provider: ProviderInterface, hash: HexString, options?: WaitOptions) {
	const { interval, retries, pass, reject } = { ...defaultOptions, ...options };

	let attempt = retries;
	while (attempt--) {
		try {
			const receipt = await provider.getTransactionReceipt(hash);
			console.log(receipt);
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
