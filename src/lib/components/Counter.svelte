<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	export let count = 0;

	function increment() {
		count += 1;
	}
</script>

<div>
	<Button onclick={increment} variant="default" size="lg">
		{count}
	</Button>
</div>
