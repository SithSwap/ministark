import { fromShortString, toShortString } from './codec.js';

describe.concurrent('short string', () => {
	it.each([
		['0x534e5f4d41494e', 'SN_MAIN'],
		['0x534e5f474f45524c49', 'SN_GOERLI'],
		['0x6465636c617265', 'declare'],
		['0x6465706c6f79', 'deploy'],
		['0x696e766f6b65', 'invoke'],
		['0x6c315f68616e646c6572', 'l1_handler'],
		['0x4d6f636b546f6b656e202334', 'MockToken #4']
	])('convert string [%s] to a shortString [%s]', (input, expected) => {
		expect(fromShortString(BigInt(input))).toEqual(expected);
	});

	it.each([
		['SN_MAIN', '0x534e5f4d41494e'],
		['SN_GOERLI', '0x534e5f474f45524c49'],
		['declare', '0x6465636c617265'],
		['deploy', '0x6465706c6f79'],
		['invoke', '0x696e766f6b65'],
		['l1_handler', '0x6c315f68616e646c6572'],
		['MockToken #4', '0x4d6f636b546f6b656e202334']
	])('convert shortString [%s] to a string [%s]', (input, expected) => {
		expect(toShortString(input)).toEqual(BigInt(expected));
	});
});
