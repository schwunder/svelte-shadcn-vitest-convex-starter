export async function testBunShell() {
	if (typeof Bun !== 'undefined') {
		const result = await Bun.$`echo "Hello from shell!"`;
		return String(result);
	}
	throw new Error('Shell commands require Bun runtime environment');
}

/*
To use direct imports instead of global Bun:

import { $ } from 'bun';

export async function testBunShell() {
    try {
        const result = await $`echo "Hello from shell!"`;
        return String(result);
    } catch (error) {
        console.error('Shell command failed:', error);
        throw new Error('Shell command execution failed');
    }
}

Required config:

1. vite.config.ts:
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit()],
    optimizeDeps: {
        exclude: ['bun']
    },
    ssr: {
        noExternal: ['bun']
    }
});

References:
- Bun Shell API: https://bun.sh/docs/runtime/shell
- Vite SSR Config: https://vitejs.dev/config/ssr-options.html

Note: Direct imports may still face SSR transformation issues during development.
The global Bun approach remains more reliable for runtime-specific features.
*/
