import { Type } from '$src/address.js';

import { explorer } from './base.js';

export default explorer(
	{
		[Network.ChainID.Mainnet]: 'https://voyager.online/',
		[Network.ChainID.Goerli]: 'https://goerli.voyager.online'
	},
	{
		[Type.Block]: 'block',
		[Type.Class]: 'class',
		[Type.Event]: 'event',
		[Type.Contract]: 'contract',
		[Type.Transaction]: 'tx'
	}
);
