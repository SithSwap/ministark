import { Type } from '$src/address.js';

import { explorer } from './base.js';

export default explorer(
	{
		[Network.ChainID.Mainnet]: 'https://starkscan.co/',
		[Network.ChainID.Goerli]: 'https://testnet.starkscan.co/',
	},
	{
		[Type.Block]: 'block',
		[Type.Class]: 'class',
		[Type.Event]: 'event',
		[Type.Token]: 'token',
		[Type.Contract]: 'contract',
		[Type.Transaction]: 'tx'
	}
);
