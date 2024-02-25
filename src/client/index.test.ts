import { ec, Account, RpcProvider } from 'starknet';
import { Multicall, writer } from './index.js';
import { HexString } from '$src/types.js';
import { ChainID } from '$src/network/network.js';

describe('client', () => {
	test('writer', () => {
		const { address, key } = { address: '0x123' as HexString, key: '0x456' as HexString };
		const provider = new RpcProvider({ nodeUrl: '' });
		const account = new Account(
			provider,
			address.toLowerCase(),
			ec.starkCurve.getStarkKey(key)
		);
		const w = writer(
			{ address, chain: ChainID.Goerli, provider, account },
			{
				[Multicall]: '0x789' as HexString,
				AMM: {
					addLiquidity: '0xabc' as HexString,
					removeLiquidity: '0xdef' as HexString
				}
			}
		);

        expect(w.chain).toBe(ChainID.Goerli);
	});
});
