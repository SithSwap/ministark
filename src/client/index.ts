import type { Provider, Account } from 'starknet';
import type { Bound, HexString } from '$src/types.js';
import type { Connection } from '$src/wallet/common.js';
import type { ChainID } from '$src/network/network.js';

import { call, estimate, execute, multicall } from '$src/call.js';

export type Lookup = {
	chain: ChainID;
	lookup: Bound<typeof lookup>;
};

export type Reader = Lookup & {
	provider: Provider;
	call: Bound<typeof call>;
	multicall: Bound<Bound<typeof multicall>>;
};

export type Writer = Reader & {
	address: HexString;
	account: Account;
	estimate: Bound<typeof estimate>;
	execute: Bound<typeof execute>;
};

type Keys = string | number | symbol;
type Deployment<K extends Keys = Keys> = { [k in K]: HexString };

export const Multicall = Symbol('Multicall');

function lookup<const D extends Deployment>(deployment: D, target: keyof D) {
	return deployment[target];
}

export function reader<const D extends Deployment & { [Multicall]: HexString }>(
	connection: Required<Pick<Connection, 'chain' | 'provider'>>,
	deployment: D
): Reader {
	return {
		chain: connection.chain,
		provider: connection.provider,
		lookup: lookup.bind(null, deployment),
		call: call.bind(null, connection.provider),
		multicall: multicall.bind(null, connection.provider, deployment[Multicall])
	};
}

export function writer<const D extends Deployment & { [Multicall]: HexString }>(
	connection: Required<Connection>,
	deployment: D
): Writer {
	return {
		...reader(connection, deployment),
		address: connection.address,
		account: connection.account,
		estimate: estimate.bind(null, connection.account),
		execute: execute.bind(null, connection.account)
	};
}
