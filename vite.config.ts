import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		includeSource: ['src/**/*.{js,ts}'],
		environmentMatchGlobs: [
			// all tests in convex/ will run in edge-runtime
			['convex/**', 'edge-runtime'],
			// all other tests use node
			['**', 'node']
		],
		server: { deps: { inline: ['convex-test'] } }
	},
	define: {
		'import.meta.vitest': 'undefined'
	}
});
