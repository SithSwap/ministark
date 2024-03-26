import { ChainID } from '$src/network/network.js';

export default {
	[ChainID.Goerli]: import.meta.env['VITE_RPC_URL_GOERLI'],
	[ChainID.Mainnet]: import.meta.env['VITE_RPC_URL_MAINNET']
} as Partial<Record<ChainID, string>>;
