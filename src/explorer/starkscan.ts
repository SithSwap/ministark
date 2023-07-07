import { Type as AddressType } from '$src/address.js';
import { ChainID } from '$src/network/index.js';
import { explorer } from './base.js';

export default explorer(
	{
		[ChainID.Mainnet]: 'https://starkscan.co/',
		[ChainID.Goerli]: 'https://testnet.starkscan.co/'
	},
	{
		[AddressType.Block]: 'block',
		[AddressType.Class]: 'class',
		[AddressType.Event]: 'event',
		[AddressType.Token]: 'token',
		[AddressType.Contract]: 'contract',
		[AddressType.Transaction]: 'tx'
	}
);
