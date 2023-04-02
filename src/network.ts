export const enum ChainID {
	// toShortString('SN_MAIN')
	Mainnet = '0x534e5f4d41494e',

	// toShortString('SN_GOERLI')
	Goerli = '0x534e5f474f45524c49'
}

export const enum Name {
	Mainnet = 'mainnet-alpha',
	Goerli = 'goerli-alpha',
	Goerli2 = 'goerli-alpha-2'
}

export type Network = {
	base: string;
	label: string;
	name: Enumerate<Name>;
	chain: Enumerate<ChainID>;
};

export const Networks: Record<ChainID, Network> = {
	[ChainID.Goerli]: {
		name: Name.Mainnet,
		chain: ChainID.Goerli,
		label: 'Alpha Görli',
		base: 'https://alpha4.starknet.io'
	},

	[ChainID.Mainnet]: {
		name: Name.Goerli,
		chain: ChainID.Mainnet,
		label: 'Alpha Mainnet',
		base: 'https://alpha-mainnet.starknet.io'
	}
};
