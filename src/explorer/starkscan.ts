import { Type } from '$src/address';
import { ChainID } from '$src/network';

import { explorer } from './base';

export default explorer(
	{
		[ChainID.Mainnet]: 'https://starkscan.co/',
		[ChainID.Goerli]: 'https://testnet.starkscan.co/'
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
