<script lang="ts">
	export let count = 0;

	function increment() {
		count += 1;
	}
</script>

<button on:click={increment}>
	{count}
</button>
