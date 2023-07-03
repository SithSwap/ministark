import { Type } from '$src/address';
import { ChainID } from '$src/network';

type Bases = Partial<Record<ChainID, string>>;
type Routes = Partial<Record<Type, string>>;

export interface Explorer {
	(chain: Enumerate<ChainID>, type: Enumerate<Type>, address: HexString): Maybe<string>;
}

export function explorer(bases: Bases, routes: Routes): Explorer {
	return (chain, type, address) => {
		const base = bases[chain];
		const route = routes[type];
		if (!route || !base) return;
		return new URL(`${route}/${address}`, base).toString();
	};
}
