import type { HexString } from '$src/types.js';

import { Multicall } from '$src/client/index.js';
import { ChainID } from '$src/network/index.js';

import CONTRACTS from '$tests/constants/contracts.js';
import { getReader } from '$tests/utilities/starknet.js';
import { Contacts } from './index.js';

import { from, to } from './name.js';

const Deployment = {
	[ChainID.Goerli]: {
		starknetid: { name: Contacts[ChainID.Goerli] as HexString },
		[Multicall]: CONTRACTS[ChainID.Goerli][Multicall]
	}
};
describe.concurrent('StarknetID', () => {
	const client = getReader(ChainID.Goerli, Deployment[ChainID.Goerli]);
	it.each([
		[0n, ''],
		['0x43812817b20b2e237017b4197f83b3bf196dc4e075f02804b6e9d2d46f7c4ae', ''],
		['0x056acc7ff24ab31c30c2404cefac4a65f2381348439ba3363db0fc9cd40a8403', ''],
		['0x5ff6e65cc6e154eeab8c80f43784a2ca6a95f7f2de51b30f9d5b90189b226f4', 'world.stark']
	])('gets name for address "%s" -> "%s"', async (address, expected) => {
		const [domain] = await to(client, [address]);
		expect(domain).toBe(expected);
	});

	it('gets multiple names at once', async () => {
		const addresses = [
			0n,
			'0xb89cc5516af1e5389c6424cf712dbec33e058e936215e907a2fa30a46b14c3',
			'0x498f7d78b9c0a7c2c58c1f8b086218fb3a659c027f469fb6c20a43d871b2aa4',
			'0x5ff6e65cc6c1f8b33b8c80f43784a2ca6a95f7f2de51b30f9d5b90189b226f4'
		];

		const domains = await to(client, addresses);
		expect(domains).toEqual(['', 'good.stark', 'gold.stark', '']);
	});

	it.each([
		['gold.stark', '0x498f7d78b9c0a7c2c58c1f8b086218fb3a659c027f469fb6c20a43d871b2aa4'],
		['hello.stark', '0x43812817b20b2e237017b4197f83b3bf196dc4e075f02804b6e9d2d46f7c4ae'],
		['go.stark', '0x3049adeec18d22dd515e4602ba291960619280f5ff73783b4e0c32775e2a136'],
		['world.stark', '0x5ff6e65cc6e154eeab8c80f43784a2ca6a95f7f2de51b30f9d5b90189b226f4'],
		['good.stark', '0xb89cc5516af1e5389c6424cf712dbec33e058e936215e907a2fa30a46b14c3']
	])('gets address from domain %s', async (domain, expected) => {
		const [address] = await from(client, [domain]);
		expect(BigInt(address)).toBe(BigInt(expected));
	});

	it('gets address from multiple domains', async () => {
		const domains = ['gold.stark', 'hello.stark', 'go.stark', 'world.stark', 'good.stark'];
		const addresses = await from(client, domains);

		expect(addresses).toEqual([
			'0x498f7d78b9c0a7c2c58c1f8b086218fb3a659c027f469fb6c20a43d871b2aa4',
			'0x43812817b20b2e237017b4197f83b3bf196dc4e075f02804b6e9d2d46f7c4ae',
			'0x3049adeec18d22dd515e4602ba291960619280f5ff73783b4e0c32775e2a136',
			'0x5ff6e65cc6e154eeab8c80f43784a2ca6a95f7f2de51b30f9d5b90189b226f4',
			'0xb89cc5516af1e5389c6424cf712dbec33e058e936215e907a2fa30a46b14c3'
		]);
	});
});
