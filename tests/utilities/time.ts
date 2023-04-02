import { vi } from 'vitest';

export function advance(times: number) {
	while (times--) vi.advanceTimersToNextTimerAsync();
}
