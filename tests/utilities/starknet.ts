import { Provider, constants } from 'starknet';
import { ChainID, Networks } from '$src/network/index.js';
import { call, multicall } from '$src/call.js';

const CONTRACTS = {
	[ChainID.Mainnet]: {
		Multicall: '0x05754af3760f3356da99aea5c3ec39ccac7783d925a19666ebbeca58ff0087f4'
	},
	[ChainID.Goerli]: {
		Multicall: '0x05754af3760f3356da99aea5c3ec39ccac7783d925a19666ebbeca58ff0087f4'
	}
} as Partial<Record<ValuesOf<typeof ChainID>, Record<string, HexString>>>;

export const TOKENS = {
	DAI: '0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9' as HexString,
	ETH: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7' as HexString,
	MOCK: [
		'0x0',
		'0x030b787c358eb75203ba2c0819412c87787c5f4aaf625d742a4a5a25ff4fdf3c',
		'0x02e438beca7010e2712a4c62ec446db6cf0f6da7367d2eb1d7201937ad962b02',
		'0x04d8720e5ca0842e8336a3bd1aa1289d53145581901e228ede77a621dfe9ddd2',
		'0x0722df8eb84b319fe54bcee1e566d978c3299ab9f20eb80aa4083c62135296de'
	] as HexString[]
};

export const ACCOUNTS = [
	{
		address: '0x076bc3DFc1B905969DAAD66cA4B8918c86f0B4715cea81b7f8dC60D408e95Ffa' as HexString
	}
];

export function reader(chain: ValuesOf<typeof ChainID>) {
	const constracts = CONTRACTS[chain];

	if (!constracts) throw new Error('Unsupported network');

	console.log(Networks);
	const network = Networks[chain].name;

	if (!network) throw new Error('Unsupported network');

	const provider = new Provider({ sequencer: { network: constants.NetworkName[network] } });

	return {
		chain,
		provider,
		call: call.bind(null, provider),
		multicall: multicall.bind(null, provider, constracts.Multicall)
	};
}
