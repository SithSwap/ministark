import type { ChainID } from '$src/network/network.js';
import type { Starknet, Asset } from './starknet.js';
import type { Connection } from './common.js';

import { Wallet } from './common.js';
import { debounce } from '$src/utilities/function.js';

declare global {
	// eslint-disable-next-line no-var
	var starknet_braavos: Starknet | undefined;
}

export default class Braavos extends Wallet {
	#connection?: Connection;
	#starknet = globalThis['starknet_braavos'];

	static get id() {
		return 'braavos' as const;
	}

	static get label() {
		return 'Braavos' as const;
	}

	static get website() {
		return 'https://braavos.app/' as const;
	}

	static get downloads() {
		return {
			chrome: 'https://chrome.google.com/webstore/detail/braavos-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma',
			firefox: 'https://addons.mozilla.org/en-US/firefox/addon/braavos-wallet'
		} as const;
	}

	get isInstalled() {
		return !!this.#starknet;
	}

	get connection() {
		return this.#connection;
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

	async activate() {
		if (!this.#starknet) throw new Error('Braavos is not installed.');
		if (await this.#starknet?.isPreauthorized()) this.connect();
		this.#starknet.on('accountsChanged', this.update);
	}

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
