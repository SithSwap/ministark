import type { HexString } from '$src/types.js';

import { ChainID } from '$src/network/index.js';

export default {
	[ChainID.Mainnet]: '0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678',
	[ChainID.Goerli]: '0x3bab268e932d2cecd1946f100ae67ce3dff9fd234119ea2f6da57d16d29fce'
} as Partial<Record<ChainID, HexString>>;
