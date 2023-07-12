import type { Account, Provider } from 'starknet';
import type { ChainID } from '$src/network/network.js';
import type { HexString } from '$src/types.js';

export type Connection<Chain extends ChainID = ChainID> = {
	address?: HexString;
	chain?: Chain;
	provider?: Provider;
	account?: Account;
};

type Subscriber<T> = (value: T) => void;

export abstract class Wallet<Chain extends ChainID = ChainID> {
	#subscribers = new Set<Subscriber<Wallet>>();

	static id: string;

	static label: string;

	static website: string;

	static downloads: {
		chrome?: `https://chrome.google.com/webstore/detail/${string}`;
		firefox?: `https://addons.mozilla.org/en-US/firefox/addon/${string}`;
	};

	abstract connection?: Connection<Chain>;
	abstract isInstalled: boolean;

	subscribe(subscriber: Subscriber<Wallet>) {
		this.#subscribers.add(subscriber);
		if (this.#subscribers.size === 1) this.activate().catch(() => subscriber(this));

		return () => {
			this.#subscribers.delete(subscriber);
			if (this.#subscribers.size === 0) this.deactivate();
		};
	}

	abstract activate(): Promise<void>;
	abstract deactivate(): void;
	abstract connect(): Promise<void>;

	protected update() {
		this.#subscribers.forEach(subscriber => subscriber(this));
	}
}
