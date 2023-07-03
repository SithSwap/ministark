import { Type } from '$src/address';
import { ChainID } from '$src/network';

import { explorer } from './base';

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
