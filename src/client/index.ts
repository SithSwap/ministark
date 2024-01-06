import type { ProviderInterface, Account } from 'starknet';
import type { Bound, HexString } from '$src/types.js';
import type { Connection } from '$src/wallet/common.js';
import type { ChainID } from '$src/network/network.js';

import { call, estimate, execute, multicall } from '$src/call.js';

export type Lookup<Chain extends ChainID = ChainID> = {
	chain: Chain;
	lookup: Bound<typeof lookup>;
};

export type Reader<Chain extends ChainID = ChainID> = Lookup<Chain> & {
	provider: ProviderInterface;
	call: Bound<typeof call>;
	multicall: Bound<Bound<typeof multicall>>;
};

export type Writer<Chain extends ChainID = ChainID> = Reader<Chain> & {
	address: HexString;
	account: Account;
	estimate: Bound<typeof estimate>;
	execute: Bound<typeof execute>;
};

type Keys = string | number | symbol;
type Deployment<K extends Keys = Keys> = { [k in K]: HexString };

export const Multicall = Symbol('Multicall');

export function lookup<const D extends Deployment>(deployment: D, target: keyof D) {
	return deployment[target];
}

export function reader<Chain extends ChainID = ChainID>(
	connection: Required<Pick<Connection<Chain>, 'chain' | 'provider'>>,
	deployment: Deployment & { [Multicall]: HexString }
): Reader<Chain> {
	return {
		chain: connection.chain,
		provider: connection.provider,
		lookup: lookup.bind(null, deployment),
		call: call.bind(null, connection.provider),
		multicall: multicall.bind(null, connection.provider, deployment[Multicall])
	};
}

export function writer<Chain extends ChainID = ChainID>(
	connection: Required<Connection<Chain>>,
	deployment: Deployment & { [Multicall]: HexString }
): Writer<Chain> {
	return {
		...reader<Chain>(connection, deployment),
		address: connection.address,
		account: connection.account,
		estimate: estimate.bind(null, connection.account),
		execute: execute.bind(null, connection.account)
	};
}
