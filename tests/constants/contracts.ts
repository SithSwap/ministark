import { ChainID } from '$src/network/index.js';
import { Multicall } from '$src/client/index.js';

export default {
	[ChainID.Mainnet]: {
		[Multicall]: '0x05754af3760f3356da99aea5c3ec39ccac7783d925a19666ebbeca58ff0087f4'
	},
	[ChainID.Goerli]: {
		[Multicall]: '0x05754af3760f3356da99aea5c3ec39ccac7783d925a19666ebbeca58ff0087f4'
	},
	[ChainID.Sepolia]: {}
} as const;
