<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$ui/button';
</script>

<Button
	onclick={toggleMode}
	variant="outline"
	size="icon"
	aria-label="Toggle theme"
	data-testid="theme-toggle-button"
>
	<Sun
		data-testid="theme-toggle-sun-icon"
		aria-hidden="true"
		aria-label="Light mode"
		data-mode="light"
	/>
	<Moon
		data-testid="theme-toggle-moon-icon"
		aria-hidden="true"
		aria-label="Dark mode"
		data-mode="dark"
	/>
	<span class="sr-only" data-testid="theme-toggle-text" aria-label="Theme Toggle Text"
		>Toggle theme</span
	>
</Button>
