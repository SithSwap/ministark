import { ChainID } from '$src/network/index.js';
import { Type as AddressType } from '$src/address.js';

type Bases = Partial<Record<ChainID, string>>;
type Routes = Partial<Record<AddressType, string>>;

export type Explorer = (chain: ChainID, type: AddressType, address: HexString) => Maybe<string>;

export function explorer(bases: Bases, routes: Routes): Explorer {
	return (chain, type, address) => {
		const base = bases[chain];
		const route = routes[type];
		if (!route || !base) return;
		return new URL(`${route}/${address}`, base).toString();
	};
}
