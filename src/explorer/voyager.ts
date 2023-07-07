import { Type as AddressType } from '$src/address.js';
import { ChainID } from '$src/network/index.js';
import { explorer } from './base.js';

export default explorer(
	{
		[ChainID.Mainnet]: 'https://voyager.online/',
		[ChainID.Goerli]: 'https://goerli.voyager.online'
	},
	{
		[AddressType.Block]: 'block',
		[AddressType.Class]: 'class',
		[AddressType.Event]: 'event',
		[AddressType.Contract]: 'contract',
		[AddressType.Transaction]: 'tx'
	}
);
