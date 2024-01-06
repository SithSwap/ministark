import type { Call as StarknetCall, Account, ProviderInterface } from 'starknet';
import type { Arrayable, BigIntish, HexString, Not } from '$src/types.js';

import { toFelt } from './codec.js';
import { selectorFor } from './hash.js';

export type BigNumberish = Not<BigIntish, boolean | bigint>; // placeholder type

export type Block = BigNumberish | 'pending' | 'latest' | null;

export type Call = {
	to: HexString;
	method: string;
	data?: BigNumberish[];
};

export type EstimateOptions = {
	nonce?: BigNumberish;
	blockIdentifier?: Block;
};

export type ExecuteOptions = {
	nonce?: BigNumberish;
	maxFee?: BigNumberish;
	version?: BigNumberish;
};

export function remap(call: Call): StarknetCall;
export function remap(calls: Call[]): StarknetCall[];
export function remap(calls: Arrayable<Call>): Arrayable<StarknetCall>;
export function remap(calls: Arrayable<Call>): Arrayable<StarknetCall> {
	if (!Array.isArray(calls))
		return { entrypoint: calls.method, contractAddress: calls.to, calldata: calls.data };

	const remaped = new Array<StarknetCall>(calls.length);
	for (let i = 0; i < calls.length; i++) {
		const { method, to, data } = calls[i];
		remaped[i] = { entrypoint: method, contractAddress: to, calldata: data };
	}
	return remaped;
}

export function toMulticallArrays(calls: Call[]) {
	const output = [new Array(calls.length), []];
	for (let i = 0; i < calls.length; i++) {
		const data = calls[i].data ?? [];
		output[0][i] = {
			to: BigInt(calls[i].to).toString(),
			selector: BigInt(selectorFor(calls[i].method)).toString(),
			data_offset: output[1].length.toString(),
			data_len: data.length.toString()
		};
		for (const d of data) output[1].push(BigInt(d).toString());
	}
	return output;
}

export function toExecuteCalldata(calls: Call[], nonce?: BigIntish) {
	const execute = new Array(calls.length * 4 + 2);
	const calldata = calls.length * 4 + 1;
	execute[0] = toFelt(calls.length.toString());
	execute[calldata] = 0;
	for (let index = 1, i = 0; i < calls.length; i++) {
		const data = calls[i].data ?? [];
		execute[index++] = toFelt(calls[i].to); // to
		execute[index++] = toFelt(selectorFor(calls[i].method)); // selector
		execute[index++] = toFelt(execute[calldata]); // data_offset
		execute[index++] = toFelt(data.length); // data_len
		execute[calldata] += data.length;
		for (const d of data) execute.push(toFelt(d));
	}
	execute[calldata] = toFelt(execute[calldata]);
	if (nonce) execute.push(toFelt(nonce));
	return execute;
}

export function call(provider: ProviderInterface, call: Call, block?: Block) {
	return provider.callContract(remap(call), block);
}

export function multicall(
	provider: ProviderInterface,
	contract: HexString,
	calls: Call[],
	block?: Block
) {
	return provider.callContract(
		{
			entrypoint: 'aggregate',
			contractAddress: contract,
			calldata: toExecuteCalldata(calls)
		},
		block
	);
}

export async function estimate(
	account: Account,
	calls: Arrayable<Call>,
	options?: EstimateOptions
) {
	const fees = await account.estimateFee(remap(calls), options);
	return {
		max: BigInt(fees.suggestedMaxFee.toString(16)),
		overall: BigInt(fees.overall_fee.toString(16)),
		consumed: fees.gas_consumed && BigInt(fees.gas_consumed.toString(16)),
		price: fees.gas_price && BigInt(fees.gas_price.toString(16))
	};
}

export function execute(account: Account, calls: Arrayable<Call>, options?: ExecuteOptions) {
	return account.execute(remap(calls), undefined, options);
}

export function parse(input: HexString[], calls = 1) {
	if (calls < 1) throw new Error('invalid calls');

	// const block = Number(input[0]);
	// const size = Number(input[1]);

	const outputs: HexString[][][] = [[]];
	let i = 2;
	let current = 0;

	while (i < input.length) {
		const size = Number(input[i++]);
		const output = input.slice(i, i + size);
		const target = outputs[current];
		target.push(output);
		i += size;
		if (i < input.length && target.length === calls) outputs[++current] = [];
	}

	return outputs;
}
