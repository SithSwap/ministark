import type { Account, Provider } from 'starknet';
import type { ChainID } from '$src/network/network.js';
import type { HexString } from '$src/types.js';

export type Connection = {
	address?: HexString;
	chain?: ChainID;
	provider?: Provider;
	account?: Account;
};

type Subscriber<T> = (value: T) => void;

export abstract class Wallet {
	#subscribers = new Set<Subscriber<Wallet>>();

	abstract id: string;

	abstract name: string;

	abstract downloads: {
		chrome?: `https://chrome.google.com/webstore/detail/${string}`;
		firefox?: `https://addons.mozilla.org/en-US/firefox/addon/${string}`;
	};

	abstract connection?: Connection;
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
