import { contains } from './array.js';

describe('contains', () => {
	it('should return true if an item is found in the array', () => {
		const array = [1, 2, 3, 4, 5];
		const items = [3, 6, 7];
		expect(contains(array, items)).toBe(true);
	});

	it('should return false if none of the items are found in the array', () => {
		const array = [1, 2, 3, 4, 5];
		const items = [6, 7];
		expect(contains(array, items)).toBe(false);
	});

	it('should return true for an empty items array', () => {
		const array = [1, 2, 3, 4, 5];
		const items = [] as number[];
		expect(contains(array, items)).toBe(true);
	});

	it('should return false for an empty array and non-empty items array', () => {
		const array = [] as number[];
		const items = [1, 2, 3];
		expect(contains(array, items)).toBe(false);
	});

	it('should work with arrays of different data types', () => {
		const array = [1, 'two', { value: 3 }, [4]];
		const items = ['two', [4], 5];
		expect(contains(array, items)).toBe(true);
	});
});
