import type { HexString } from '$src/types.js';
import type { Deployment, Multicall } from '$src/client/index.js';

import { RpcProvider } from 'starknet';
import { ChainID } from '$src/network/index.js';
import { reader } from '$src/client/index.js';

import RPCs from '../constants/rpc.js';
import CONTRACTS from '../constants/contracts.js';

const Supported = [ChainID.Goerli, ChainID.Mainnet];
type Supported = (typeof Supported)[number];

export function getReader<D extends Deployment>(chain: Supported, deployment?: D) {
	const rpc = RPCs[chain];

	if (!rpc) throw new Error(`no RPC provided for selected network [${chain}]`);
	deployment = deployment ?? (CONTRACTS[chain] as unknown as D);
	if (!deployment) throw new Error('Missing contracts');

	const provider = new RpcProvider({ nodeUrl: rpc });
	return reader<Supported, D>({ chain, provider }, deployment as D & { [Multicall]: HexString });
}
