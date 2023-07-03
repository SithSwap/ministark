import { Type } from '$src/address.js';
import { ChainID } from '$src/network.js';

import { explorer } from './base.js';

export default explorer(
	{
		[ChainID.Mainnet]: 'https://voyager.online/',
		[ChainID.Goerli]: 'https://goerli.voyager.online'
	},
	{
		[Type.Block]: 'block',
		[Type.Class]: 'class',
		[Type.Event]: 'event',
		[Type.Contract]: 'contract',
		[Type.Transaction]: 'tx'
	}
);
