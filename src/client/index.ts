import type { ProviderInterface, Account } from 'starknet';
import type { Arrayable, Bound, HexString } from '$src/types.js';
import type { Connection } from '$src/wallet/common.js';
import type { ChainID } from '$src/network/network.js';

import { call, estimate, execute, multicall } from '$src/call.js';

export type Lookup<C extends ChainID = ChainID, D extends Deployment = Deployment> = {
	chain: C;
	readonly lookup: D;
};

export type Reader<C extends ChainID = ChainID, D extends Deployment = Deployment> = Lookup<
	C,
	D
> & {
	provider: ProviderInterface;
	call: Bound<typeof call>;
	multicall: Bound<Bound<typeof multicall>>;
};

export type Writer<C extends ChainID = ChainID, D extends Deployment = Deployment> = Reader<
	C,
	D
> & {
	address: HexString;
	account: Account;
	estimate: Bound<typeof estimate>;
	execute: Bound<typeof execute>;
};

export type Keys = string | number | symbol;
export type Deployment<K extends Keys = Keys> = {
	[k in K]:
		| Arrayable<HexString | Deployment>
		| ReadonlyArray<Deployment>
		| ReadonlyArray<HexString>;
};

export const Multicall = Symbol('Multicall');

export function reader<Chain extends ChainID = ChainID, const D extends Deployment = Deployment>(
	connection: Required<Pick<Connection<Chain>, 'chain' | 'provider'>>,
	deployment: D & { [Multicall]: HexString }
): Reader<Chain, D> {
	return {
		chain: connection.chain,
		provider: connection.provider,
		lookup: Object.freeze(deployment),
		call: call.bind(null, connection.provider),
		multicall: multicall.bind(null, connection.provider, deployment[Multicall])
	};
}

export function writer<C extends ChainID = ChainID, const D extends Deployment = Deployment>(
	connection: Required<Connection<C>>,
	deployment: D & { [Multicall]: HexString }
): Writer<C, D> {
	return {
		...reader<C, D>(connection, deployment),
		address: connection.address,
		account: connection.account,
		estimate: estimate.bind(null, connection.account),
		execute: execute.bind(null, connection.account)
	};
}
