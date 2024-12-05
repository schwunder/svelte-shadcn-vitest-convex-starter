import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		globals: true,
		includeSource: ['src/**/*.{js,ts}'],
		environmentMatchGlobs: [
			// all tests in convex/ will run in edge-runtime
			['convex/**', 'edge-runtime'],
			// Make this pattern more specific to match your component tests
			['src/lib/components/**/*.{spec,test}.{js,ts}', 'jsdom'],
			// all other tests use node
			['**', 'node']
		],
		server: { deps: { inline: ['convex-test'] } }
	},
	define: {
		'import.meta.vitest': 'undefined'
	},
	// Tell Vitest to use the `browser` entry points in `package.json` files, even though it's running in Node
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined
});
