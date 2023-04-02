import { ChainID } from './network';
import { Type } from './address';

type Bases = Partial<Record<ChainID, string>>;
type Routes = Partial<Record<Type, string>>;

export interface Explorer {
	(chain: Enumerate<ChainID>, type: Enumerate<Type>, address: HexString): Maybe<string>;
}

function explorer(bases: Bases, routes: Routes): Explorer {
	return (chain, type, address) => {
		const base = bases[chain];
		const route = routes[type];
		if (!route || !base) return;
		return new URL(`${route}/${address}`, base).toString();
	};
}

export const starkscan = explorer(
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

export const voyager = explorer(
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

starkscan('0x534e5f474f45524c49', 'contract', '0x0000000');
