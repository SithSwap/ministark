import { RpcProvider } from 'starknet';

import CONTRACTS from '$tests/constants/contracts.js';
import RPCs from '$tests/constants/rpc.js';

import { ChainID } from '$src/network/network.js';
import { Multicall } from '$src/client/index.js';

import { hash } from './contract.js';

describe('Contract Hash', () => {
	it('fetch contract hash', async () => {
		const provider = new RpcProvider({ nodeUrl: RPCs[ChainID.Goerli] });
		const value = await hash(provider, CONTRACTS[ChainID.Goerli][Multicall]);

		expect(value).toBeDefined();
		expect(value?.startsWith('0x')).toBe(true);
	});
});
