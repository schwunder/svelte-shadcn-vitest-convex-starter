<script lang="ts">
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { LightSwitch, Counter } from '$components';
	import '../app.css';

	const { children } = $props();
	setupConvex(PUBLIC_CONVEX_URL);

	// Set dark mode by default
	if (typeof document !== 'undefined') {
		document.documentElement.classList.add('dark');
		localStorage.setItem('mode-watcher-mode', 'dark');
	}
</script>

<header>
	<LightSwitch />
	<Counter />
</header>

<ModeWatcher defaultMode="dark" />
{@render children()}
