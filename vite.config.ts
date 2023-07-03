import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest';

import { fileURLToPath } from 'url';

export default {
	resolve: {
		alias: {
			$tests: fileURLToPath(new URL('tests', import.meta.url)),
			$src: fileURLToPath(new URL('src', import.meta.url))
		}
	},

	build: {
		emptyOutDir: false,
		outDir: 'dist',
		sourcemap: true,
		lib: {
			entry: {
				index: fileURLToPath(new URL('src/index.ts', import.meta.url)),
				address: fileURLToPath(new URL('src/address.ts', import.meta.url)),
				starknetid: fileURLToPath(new URL('src/starknetid/index.ts', import.meta.url))
			},
			formats: ['es']
		}
	},

	test: {
		globals: true,
		testTimeout: 60000,
		setupFiles: [fileURLToPath(new URL('tests/setup.ts', import.meta.url))]
	}
} satisfies UserConfig & { test: InlineConfig };
