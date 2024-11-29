<script lang="ts">
	import { Button } from '$ui/button';

	export let count = 0;

	function increment() {
		count += 1;
	}
</script>

<Button onclick={increment} variant="default" size="lg" aria-label="Counter" data-testid="counter">
	{count}
</Button>
