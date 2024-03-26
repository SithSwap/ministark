import { ChainID } from '$src/network/network.js';

export default {
	// [ChainID.Goerli]: import.meta.env['VITE_RPC_URL_GOERLI'],
	// [ChainID.Mainnet]: import.meta.env['VITE_RPC_URL_MAINNET']

	[ChainID.Goerli]: 'https://starknet-goerli.g.alchemy.com/v2/n0Yg51cD7qDI_65QKVLSZcj9oeHQ3sGt',
	[ChainID.Mainnet]: ''
} as Partial<Record<ChainID, string>>;
