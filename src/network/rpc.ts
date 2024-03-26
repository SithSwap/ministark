import { ChainID } from './network.js';

export const Version = 'v0_7';

export default {
	[ChainID.Mainnet]: [
		`https://starknet-mainnet.public.blastapi.io/rpc/${Version}`,
		`https://free-rpc.nethermind.io/mainnet-juno/${Version}`
	],
	[ChainID.Goerli]: [
		`https://starknet-testnet.public.blastapi.io/rpc/${Version}`,
		`https://free-rpc.nethermind.io/goerli-juno/${Version}`
	],
	[ChainID.Sepolia]: [
		`https://starknet-sepolia.public.blastapi.io/rpc/${Version}`,
		`https://free-rpc.nethermind.io/sepolia-juno/${Version}`
	]
} as Record<ChainID, string[]>;
