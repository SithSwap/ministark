import { transaction } from 'starknet';
import ACCOUNTS from '$tests/constants/accounts.js';
import TOKENS from '$tests/constants/tokens.js';

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

	it('Long call name', () => {
		transaction.fromCallsToExecuteCalldata_cairo1([
			{
				contractAddress: TOKENS['DAI'],
				entrypoint: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
				calldata: [
					'0x120d73fc42b180c',
					'0x0',
					'0x2d4ea7b71ada',
					'0x0',
					'0x1',
					'0xda114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
					'0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
					'0x0',
					'0x67358bdf1ff1451a0f1234f6239a705bea1813c10f3c4cb9728d4d13f26657c',
					'0x6501c04d'
				]
			}
		]);
	});
});
