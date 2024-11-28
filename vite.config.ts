import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		includeSource: ['src/**/*.{js,ts}']
	},
	define: {
		'import.meta.vitest': 'undefined'
	}
});
