export const ChainID = Object.freeze({
	Mainnet: '0x534e5f4d41494e', // toShortString('SN_MAIN')
	Goerli: '0x534e5f474f45524c49', // toShortString('SN_GOERLI')
	Goerli2: '0x534e5f474f45524c4932' // toShortString('SN_GOERLI2')
} as const);

export type ChainID = ValuesOf<typeof ChainID>;

export type Info = {
	base: string;
	label: string;
	name: Enumerate<Name>;
	chain: ValuesOf<typeof ChainID>;
};

const enum Name {
	Mainnet = 'SN_MAIN',
	Goerli = 'SN_GOERLI',
	Goerli2 = 'SN_GOERLI2'
}

export const Networks: Record<ChainID, Info> = {
	[ChainID.Goerli]: {
		name: Name.Mainnet,
		chain: ChainID.Goerli,
		label: 'Alpha Görli',
		base: 'https://alpha4.starknet.io'
	},

	[ChainID.Goerli2]: {
		name: Name.Goerli2,
		chain: ChainID.Goerli2,
		label: 'Alpha Görli 2',
		base: 'https://alpha4-2.starknet.io'
	},

	[ChainID.Mainnet]: {
		name: Name.Goerli,
		chain: ChainID.Mainnet,
		label: 'Alpha Mainnet',
		base: 'https://alpha-mainnet.starknet.io'
	}
};
