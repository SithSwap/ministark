import { ChainID } from '$src/network/index.js';

export const RPCs: Partial<Record<ChainID, string>> = {
	[ChainID.Goerli]: import.meta.env['VITE_RPC_URL_GOERLI'],
	[ChainID.Mainnet]: import.meta.env['VITE_RPC_URL_MAINNET']
};
