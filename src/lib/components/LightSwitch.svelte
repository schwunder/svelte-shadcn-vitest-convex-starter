<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$ui/button';
</script>

<Button onclick={toggleMode} variant="outline" size="icon">
	<Sun />
	<Moon />
	<span class="sr-only">Toggle theme</span>
</Button>
