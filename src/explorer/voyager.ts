import { explorer } from './base.js';

export default explorer(
	{
		[Network.ChainID.Mainnet]: 'https://voyager.online/',
		[Network.ChainID.Goerli]: 'https://goerli.voyager.online'
	},
	{
		[Address.Type.Block]: 'block',
		[Address.Type.Class]: 'class',
		[Address.Type.Event]: 'event',
		[Address.Type.Contract]: 'contract',
		[Address.Type.Transaction]: 'tx'
	}
);
