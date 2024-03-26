import type { BigIntish, HexString } from '$src/types.js';
import type { ChainID } from '$src/network/network.js';
import type { Reader } from '$src/client/index.js';

import { toFelt } from '$src/index.js';

import { decode, encode } from './codec.js';

type Client = Reader<ChainID, { starknetid: { name: HexString } }>;

export async function to(client: Client, addresses: BigIntish[]) {
	const contract = client.lookup.starknetid.name;
	if (!contract) throw new Error('Starknet ID contract not found');

	try {
		const calls = Array(addresses.length);
		for (let i = 0; i < addresses.length; i++) {
			calls[i] = {
				to: contract,
				method: 'address_to_domain',
				data: [toFelt(addresses[i])]
			};
		}

		const { result } = await client.multicall(calls);

		if (!result) throw Error('Could not get stark name');

		const domains = new Array<string>(addresses.length);
		for (let i = 2, j = 0; j < addresses.length; j++) {
			const step = Number(BigInt(result[i]));
			if (step === 1) domains[j] = '';
			else {
				const size = Number(BigInt(result[i + 1]));
				const parts = new Array<bigint>(size);
				for (let k = 0; k < size; k++) {
					parts[k] = BigInt(result[i + k + 2]);
				}
				domains[j] = decode(parts);
			}
			i += step + 1;
		}
		return domains;
	} catch (e) {
		throw Error('Could not get stark name');
	}
}

export async function from(client: Client, domains: string[]) {
	const contract = client.lookup.starknetid.name;
	if (!contract) throw new Error('Starknet ID contract not found');

	try {
		const calls = Array(domains.length);
		for (let i = 0; i < domains.length; i++) {
			calls[i] = {
				to: contract,
				method: 'domain_to_address',
				data: ['1', toFelt(encode(domains[i].replace('.stark', ''))), '1', '0']
			};
		}

		const { result } = await client.multicall(calls);
		if (!result) throw Error('Could not get address from stark name');

		const addresses = new Array<HexString>(domains.length);
		for (let i = 2, j = 0; j < domains.length; i += 2, j += 1) {
			addresses[j] = result[i + 1] as HexString;
		}

		return addresses;
	} catch (e) {
		throw Error('Could not get address from stark name');
	}
}
