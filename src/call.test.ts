import { TOKENS, ACCOUNTS } from '$tests/utilities/starknet';

import { transaction } from 'starknet';
import { remap, toMulticallArrays, toExecuteCalldata, type Call } from './call';

const CALLS: Call[] = [
	{ to: TOKENS['DAI'], method: 'balanceOf', data: [ACCOUNTS[0].address] },
	{ to: TOKENS['DAI'], method: 'decimals' }
];

const REMAPPED = remap(CALLS);

describe.concurrent('Calls', () => {
	it('transform calls to multicall array correctly', () => {
		const target = toMulticallArrays(CALLS);
		const original = transaction.transformCallsToMulticallArrays(REMAPPED);
		expect(target[0]).toStrictEqual(original.callArray);
		expect(target[1]).toStrictEqual(original.calldata);
	});

	it('transforms calls to execute calldata correctly', () => {
		const target = toExecuteCalldata(CALLS);
		const original = transaction.fromCallsToExecuteCalldata(REMAPPED);
		expect(target).toStrictEqual(original);
	});

	it('transforms calls to execute calldata with nonce correctly', () => {
		const target = toExecuteCalldata(CALLS, 2);
		const original = transaction.fromCallsToExecuteCalldataWithNonce(REMAPPED, 2);
		expect(target).toStrictEqual(original);
	});
});
