export function contains<T>(array: T[], items: T[]): boolean {
	if (items.length === 0) return true;
	for (const item of items) if (array.includes(item)) return true;
	return false;
}
