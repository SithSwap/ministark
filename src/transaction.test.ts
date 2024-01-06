import type { HexString } from '$src/types.js';

import { RpcProvider, GetTransactionReceiptResponse, ProviderInterface } from 'starknet';
import { advance } from '$tests/utilities/time.js';
import { RPCs } from '$tests/client.js';
import { wait, Rejected, Timeout, Status } from './transaction.js';
import { ChainID } from '$src/network/network.js';

function generateReceipt(hash: HexString, status?: Status) {
	return {
		type: 'INVOKE',
		transaction_hash: hash,
		status: status,
		finality_status: status,
		actual_fee: '0',
		execution_status: 'SUCCEEDED',
		block_hash: '0x1234',
		block_number: 1234,
		messages_sent: [],
		revert_reason: '',
		events: [],
		execution_resources: {
			steps: '0x1',
			memory_holes: '0x1',
			range_check_builtin_applications: '0x1',
			pedersen_builtin_applications: '0x1',
			poseidon_builtin_applications: '0x1',
			ec_op_builtin_applications: '0x1',
			ecdsa_builtin_applications: '0x1',
			bitwise_builtin_applications: '0x1',
			keccak_builtin_applications: '0x1'
		}
	} as GetTransactionReceiptResponse;
}
describe('transaction', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should wait for a transaction', async () => {
		const runs = 3;
		const provider = new RpcProvider({ nodeUrl: RPCs[ChainID.Goerli] }) as ProviderInterface;
		const mock = vi
			.spyOn(provider, 'getTransactionReceipt')
			.mockImplementation(async hash =>
				generateReceipt(
					hash as HexString,
					mock.mock.calls.length >= runs ? 'ACCEPTED_ON_L2' : undefined
				)
			);

		const promise = wait(provider, '0x1234');
		advance(runs);
		const receipt = await promise;

		expect(receipt?.status).toBe('ACCEPTED_ON_L2');
		expect(mock).toBeCalledTimes(runs);
	});

	it('should reject a transaction', async () => {
		const runs = 3;
		const provider = new RpcProvider({ nodeUrl: RPCs[ChainID.Goerli] }) as ProviderInterface;
		const mock = vi
			.spyOn(provider, 'getTransactionReceipt')
			.mockImplementation(async hash =>
				generateReceipt(
					hash as HexString,
					mock.mock.calls.length >= runs ? 'REJECTED' : 'NOT_RECEIVED'
				)
			);
		provider.getTransactionReceipt('');
		try {
			const promise = wait(provider, '0x1234', { reject: ['REJECTED'] });
			advance(runs);
			await promise;
		} catch (e) {
			expect(e).instanceOf(Rejected);
			expect((<Error>e).message).toBe('transaction failed with status REJECTED');
			expect(mock).toBeCalledTimes(runs);
		}
	});

	it('should timesout', async () => {
		const runs = 5;
		const provider = new RpcProvider({ nodeUrl: RPCs[ChainID.Goerli] }) as ProviderInterface;
		const mock = vi
			.spyOn(provider, 'getTransactionReceipt')
			.mockImplementation(async hash => generateReceipt(hash as HexString, undefined));

		try {
			const promise = wait(provider, '0x1234', { retries: runs });
			advance(runs);
			await promise;
		} catch (e) {
			expect(e).instanceOf(Timeout);
			expect((<Error>e).message).toBe(`timed-out after ${runs} attempts`);
			expect(mock).toBeCalledTimes(runs);
		}
	});
});
