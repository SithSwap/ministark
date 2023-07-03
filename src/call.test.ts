import { transaction } from 'starknet';
import { TOKENS, ACCOUNTS } from '$tests/utilities/starknet.js';
import { remap, toMulticallArrays, toExecuteCalldata, type Call } from './call.js';

const CALLS: Call[] = [
	{ to: TOKENS['DAI'], method: 'balanceOf', data: [ACCOUNTS[0].address] },
	{ to: TOKENS['DAI'], method: 'balanceOf', data: [ACCOUNTS[0].address] },
	{ to: TOKENS['DAI'], method: 'balanceOf', data: [ACCOUNTS[0].address] },
	{ to: TOKENS['ETH'], method: 'decimals' },
	{ to: TOKENS['DAI'], method: 'decimals' },
	{ to: TOKENS['ETH'], method: 'balanceOf', data: [ACCOUNTS[0].address] }
];

const REMAPPED = remap(CALLS);

describe.concurrent('Calls', () => {
	it('transform calls to multicall array correctly', () => {
		const target = toMulticallArrays(CALLS);
		const original = transaction.transformCallsToMulticallArrays(REMAPPED);
		expect(target[0]).toStrictEqual(original.callArray);
		//TODO update multicall contract
		expect(target[1]).toStrictEqual(original.calldata.splice(1));
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
