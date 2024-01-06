import type { ChainID } from '$src/network/network.js';
import type { Starknet, Asset } from './starknet.js';
import type { Connection } from './common.js';

import { Wallet } from './common.js';
import { debounce } from '$src/utilities/function.js';

declare global {
	// eslint-disable-next-line no-var
	var starknet_okxwallet: Starknet | undefined;
}

export default class OKX<Chain extends ChainID = ChainID> extends Wallet<Chain> {
	#connection?: Connection<Chain>;
	#starknet = globalThis['starknet_okxwallet'];

	static get id() {
		return 'okxwallet' as const;
	}

	static get label() {
		return 'OKX Wallet' as const;
	}

	static get website() {
		return 'https://www.okx.com/web3' as const;
	}

	static get downloads() {
		return {
			chrome: 'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
			firefox: 'https://addons.mozilla.org/en-US/firefox/addon/okxwallet'
		} as const;
	}

	get isInstalled() {
		return !!this.#starknet;
	}

	get isConnected() {
		return !!this.#starknet?.isConnected;
	}

	get connection() {
		return this.#connection;
	}

	async activate() {
		if (!this.#starknet) throw new Error('OKX Wallet is not installed.');
		if (await this.#starknet?.isPreauthorized()) this.connect();
		this.#starknet.on('accountsChanged', this.update);
	}

	update = debounce(async () => {
		this.#connection = undefined;
		if (this.#starknet?.isConnected) {
			const chain = await this.#starknet.provider.getChainId();
			this.#connection = {
				address: this.#starknet.selectedAddress,
				chain: chain as Chain,
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
