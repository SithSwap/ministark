import type { ChainID } from '$src/network/network.js';
import type { Starknet, Asset } from './starknet.js';
import type { Connection } from './common.js';

import { Wallet } from './common.js';
import { debounce } from '$src/utilities/function.js';

declare global {
	// eslint-disable-next-line no-var
	var starknet_argentX: Starknet | undefined;
}

export default class ArgentX extends Wallet {
	#connection?: Connection;
	#starknet = globalThis['starknet_argentX'];

	static get id() {
		return 'argentX' as const;
	}

	static get label() {
		return 'Argent X' as const;
	}

	static get downloads() {
		return {
			chrome: 'https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb',
			firefox: 'https://addons.mozilla.org/en-US/firefox/addon/argent-x'
		} as const;
	}

	get isInstalled() {
		return !!this.#starknet;
	}

	get connection() {
		return this.#connection;
	}

	async activate() {
		if (!this.#starknet) throw new Error('ArgentX is not installed.');
		if (await this.#starknet?.isPreauthorized()) this.connect();
		this.#starknet.on('accountsChanged', this.update);
	}

	update = debounce(async () => {
		this.#connection = undefined;
		if (this.#starknet?.isConnected) {
			const chain = await this.#starknet.provider.getChainId();
			this.#connection = {
				address: this.#starknet.selectedAddress,
				chain: chain as ChainID,
				provider: this.#starknet.provider,
				account: this.#starknet.account
			};
		}
		super.update();
	}, 250);

	deactivate() {
		this.#starknet?.off('accountsChanged', this.update);
	}

	async connect() {
		try {
			await this.#starknet?.enable();
		} finally {
			this.update();
		}
	}

	watch(asset: Asset) {
		return this.#starknet?.request({
			type: 'wallet_watchAsset',
			params: {
				type: 'ERC20',
				options: asset
			}
		});
	}
}
