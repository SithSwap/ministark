import type { Enumerate, ValuesOf } from '$src/types.js';

export const ChainID = Object.freeze({
	Mainnet: '0x534e5f4d41494e', // toShortString('SN_MAIN')
	Goerli: '0x534e5f474f45524c49', // toShortString('SN_GOERLI')
	Sepolia: '0x534e5f5345504f4c4941' // toShortString('SN_SEPOLIA')
});

export type ChainID = ValuesOf<typeof ChainID>;

const enum Name {
	Mainnet = 'SN_MAIN',
	Goerli = 'SN_GOERLI',
	Sepolia = 'SN_SEPOLIA'
}

export type Info = {
	base: string;
	label: string;
	name: Enumerate<Name>;
	chain: ValuesOf<typeof ChainID>;
};

export const Networks: Record<ChainID, Info> = {
	[ChainID.Mainnet]: {
		name: Name.Mainnet,
		chain: ChainID.Mainnet,
		label: 'Mainnet',
		base: 'https://alpha-mainnet.starknet.io'
	},
	[ChainID.Goerli]: {
		name: Name.Mainnet,
		chain: ChainID.Goerli,
		label: 'Goerli',
		base: 'https://alpha4.starknet.io'
	},
	[ChainID.Sepolia]: {
		name: Name.Sepolia,
		chain: ChainID.Sepolia,
		label: 'Sepolia',
		base: 'https://alpha-sepolia.starknet.io'
	}
};
