export const Networks: Record<Enumerate<Network.ChainID>, Network.Info> = {
	[Network.ChainID.Goerli]: {
		name: Network.Name.Mainnet,
		chain: Network.ChainID.Goerli,
		label: 'Alpha Görli',
		base: 'https://alpha4.starknet.io'
	},

	[Network.ChainID.Goerli2]: {
		name: Network.Name.Goerli2,
		chain: Network.ChainID.Goerli2,
		label: 'Alpha Görli 2',
		base: 'https://alpha4-2.starknet.io'
	},

	[Network.ChainID.Mainnet]: {
		name: Network.Name.Goerli,
		chain: Network.ChainID.Mainnet,
		label: 'Alpha Mainnet',
		base: 'https://alpha-mainnet.starknet.io'
	}
};

export const ChainID = Object.freeze<ToRecord<typeof Network.ChainID>>({
	Mainnet: Network.ChainID.Mainnet,
	Goerli: Network.ChainID.Goerli,
	Goerli2: Network.ChainID.Goerli2
});