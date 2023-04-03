import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

export default defineConfig({
	resolve: {
		alias: {
			$tests: fileURLToPath(new URL('tests', import.meta.url)),
			$src: fileURLToPath(new URL('src', import.meta.url))
		}
	},

	build: {
		outDir: 'dist',
		sourcemap: true,

		lib: {
			entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
			name: 'ministark',
			fileName: 'ministark'
		}
	},

	test: {
		globals: true,
		testTimeout: 60000,
		coverage: { provider: 'istanbul' },
		setupFiles: [fileURLToPath(new URL('tests/setup.ts', import.meta.url))]
	}
});
