import { getChecksumAddress } from 'starknet';
import { checksum } from './address';

describe.concurrent('address', () => {
	it.each([
		'0x0',
		'1046018129117085364570375634436828708458638041367712066803465972273221326828',
		'1595205607103590314772694505705779286546289047343440031679609688989046368307',
		'2929660056800789497313746494104025672832185083822179314408467392086572039602',
		'3125233003742274159337077263027988274767675839538167078474582185083738685353',
		'3520937409262282877271138872285806727143530896462886803467226786750570525105'
	])('get address checksum', address => {
		expect(checksum(address)).toEqual(getChecksumAddress(address));
	});
});
