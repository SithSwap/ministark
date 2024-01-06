import { hash as starknetHash, ec, selector as OGSelector } from 'starknet';
import { TOKENS } from '$tests/utilities/starknet.js';
import { contract, hash, selectorFor, pedersen } from './hash.js';

const { calculateContractAddressFromHash, computeHashOnElements, getSelectorFromName } =
	starknetHash;

describe('compare', () => {
	it.each([
		[1, 2],
		['0x123213123', '0x0fe2123c'],
		['0x12773', '0x872362'],
		['0x79dc0da7c54b95f10aa182ad0a46400db63156920adb65eca2654c0945a463', '034234324']
	])('pedersen works for [%s. %s]', async (a, b) => {
		const excepted = BigInt(ec.starkCurve.pedersen(BigInt(a), BigInt(b)));
		expect(pedersen(a, b)).toEqual(excepted);
	});
});

describe.concurrent('hashing', () => {
	it.each([
		[1, 2],
		['0x123213123', '0x0fe2123c'],
		['0x12773', '0x872362'],
		['0x79dc0da7c54b95f10aa182ad0a46400db63156920adb65eca2654c0945a463', '034234324']
	])('pedersen works for [%s. %s]', async (a, b) => {
		expect(pedersen(a, b)).toEqual(BigInt(ec.starkCurve.pedersen(BigInt(a), BigInt(b))));
	});

	test.each([
		['test', '0x22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658'],
		['initialize', '0x79dc0da7c54b95f10aa182ad0a46400db63156920adb65eca2654c0945a463'],
		['mint', '0x2f0b3c5710379609eb5495f1ecd348cb28167711b73609fe565a72734550354'],
		[
			'swapExactTokensForTokensSupportingFeeOnTransferTokens',
			'0x39d1cc435aba4b7727e32d1d8c6874f419df6432f3c1fd27d4e29d104abf'
		],
		[
			'swapExactTokensForTokens',
			'0x2c0f7bf2d6cf5304c29171bf493feb222fef84bdaf17805a6574b0c2e8bcc87'
		]
	])('gets the correct selector for "%s"', (name, hash) => {
		const selector = getSelectorFromName(name);
		expect(selector).toBe(hash);
		expect(selectorFor(name)).toBe(selector);
		expect(selectorFor(name)).toBe(OGSelector.getSelector(name));
	});

	it.each([
		// prettier-ignore
		[[123782376, 213984, 128763521321],'0x7b422405da6571242dfc245a43de3b0fe695e7021c148b918cd9cdb462cac59'],
		[[], '0x49ee3eba8c1600700ee1b87eb599f16716b0b1022947733551fde4050ca6804'],
		[['1', '2', '3', '4'], '0x66bd4335902683054d08a0572747ea78ebd9e531536fb43125424ca9f902084'],
		[['1', '2'], '0x501a3a8e6cd4f5241c639c74052aaa34557aafa84dd4ba983d6443c590ab7df']
	])('should compute the correct hash %s -> %s', async (input, excepted) => {
		expect(computeHashOnElements(input)).toEqual(excepted);
		expect(hash(input)).toEqual(BigInt(excepted));
	});

	it('should compute the correct hash for a contract', async () => {
		const Factory = '0x249827618A01858A72B7D04339C47195A324D20D6037033DFE2829F98AFF4FC';
		const Hash = '0x55187E68C60664A947048E0C9E5322F9BF55F7D435ECDCF17ED75724E77368F';
		const expected = '0x36dc8dcb3440596472ddde11facacc45d0cd250df764ae7c3d1a360c853c324';
		const salt = pedersen(TOKENS.ETH, TOKENS.DAI);

		const original = calculateContractAddressFromHash(
			`0x${salt.toString(16)}`,
			Hash,
			[TOKENS.ETH, TOKENS.DAI, Factory],
			Factory
		);

		expect(original).toEqual(expected);

		const address = contract(Factory, salt, Hash, [TOKENS.ETH, TOKENS.DAI, Factory]);

		expect(address).toEqual(original);
	});
});
