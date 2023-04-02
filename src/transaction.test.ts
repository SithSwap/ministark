import { advance } from '$tests/utilities/time';
import { Provider } from 'starknet';
import { wait, Rejected, Timeout } from './transaction';

describe('transaction', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should wait for a transaction', async () => {
		const runs = 3;
		const provider = new Provider({ sequencer: { network: 'goerli-alpha' } });
		const mock = vi.spyOn(provider, 'getTransactionReceipt').mockImplementation(async hash => ({
			transaction_hash: hash,
			status: mock.mock.calls.length >= runs ? 'ACCEPTED_ON_L2' : 'NOT_RECEIVED'
		}));
		const promise = wait(provider, '0x1234');
		advance(runs);
		const receipt = await promise;

		expect(receipt?.status).toBe('ACCEPTED_ON_L2');
		expect(mock).toBeCalledTimes(runs);
	});

	it('should reject a transaction', async () => {
		const runs = 3;
		const provider = new Provider({ sequencer: { network: 'goerli-alpha' } });
		const mock = vi.spyOn(provider, 'getTransactionReceipt').mockImplementation(async hash => ({
			transaction_hash: hash,
			status: mock.mock.calls.length >= runs ? 'REJECTED' : 'NOT_RECEIVED'
		}));

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
		const provider = new Provider({ sequencer: { network: 'goerli-alpha' } });
		const mock = vi.spyOn(provider, 'getTransactionReceipt').mockImplementation(async hash => ({
			transaction_hash: hash,
			status: 'NOT_RECEIVED'
		}));

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
