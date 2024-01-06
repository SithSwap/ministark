import type { Account, ProviderInterface } from 'starknet';
import { HexString } from '$src/types.js';

export interface Asset {
	address: string; // The hexadecimal StarkNet address of the token contract
	name: string; // The name of the token - not in spec
	symbol: string; // A ticker symbol or shorthand, up to 5 characters
	decimals: number; // The number of asset decimals
	image?: string; // A string url of the token logo
}

export type EventType = 'accountsChanged' | 'networkChanged';

export type EventHandler = (data: unknown) => void;

export type RPCMessage =
	| { type: 'wallet_watchAsset'; params: Asset; result: boolean }
	| { type: string; params: unknown; result: never };

export interface Starknet {
	request: <T extends RPCMessage>(call: Omit<T, 'result'>) => Promise<T['result']>;
	enable: (options?: { showModal?: boolean }) => Promise<string[]>;
	isPreauthorized: () => Promise<boolean>;
	on: (event: EventType, handleEvent: EventHandler) => void;
	off: (event: EventType, handleEvent: EventHandler) => void;

	id: string;
	version: string;
	provider: ProviderInterface;
	isConnected: boolean;
	account: Account;
	selectedAddress?: HexString;
}
