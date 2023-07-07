import type { Type } from '$src/address.js';

type Bases = Partial<Record<Enumerate<Network.ChainID>, string>>;
type Routes = Partial<Record<Enumerate<Type>, string>>;

export interface Explorer {
	(chain: Enumerate<Network.ChainID>, type: Enumerate<Type>, address: HexString): Maybe<string>;
}

export function explorer(bases: Bases, routes: Routes): Explorer {
	return (chain, type, address) => {
		const base = bases[chain];
		const route = routes[type];
		if (!route || !base) return;
		return new URL(`${route}/${address}`, base).toString();
	};
}
