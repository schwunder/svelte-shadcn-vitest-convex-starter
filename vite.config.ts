import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		includeSource: ['src/**/*.{js,ts}']
	},
	define: {
		'import.meta.vitest': 'undefined'
	}
});
