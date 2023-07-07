import { explorer } from './base.js';

export default explorer(
	{
		[Network.ChainID.Mainnet]: 'https://starkscan.co/',
		[Network.ChainID.Goerli]: 'https://testnet.starkscan.co/',
	},
	{
		[Address.Type.Block]: 'block',
		[Address.Type.Class]: 'class',
		[Address.Type.Event]: 'event',
		[Address.Type.Token]: 'token',
		[Address.Type.Contract]: 'contract',
		[Address.Type.Transaction]: 'tx'
	}
);
