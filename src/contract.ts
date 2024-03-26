import type { ProviderInterface } from 'starknet';
import { HexString } from './types.js';

// eslint-disable-next-line @typescript-eslint/ban-types
type Block = 'pending' | 'latest' | (string & {}) | number | bigint | null;

export async function hash(provider: ProviderInterface, address: HexString, block?: Block) {
	try {
		return await provider.getClassHashAt(address, block);
	} catch {
		return undefined;
	}
}
