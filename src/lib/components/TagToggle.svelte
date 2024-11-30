<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '$ui/toggle-group';

	const sampleTags = ['tag1', 'tag2', 'tag3'];
	export let selectedTags: string[] = [];
</script>

<ToggleGroup
	type="multiple"
	bind:value={selectedTags}
	aria-label="Tags"
	data-testid="tag-toggle-group"
>
	{#each sampleTags as tag}
		<ToggleGroupItem value={tag} aria-label={`Toggle ${tag}`} data-testid={`tag-toggle-${tag}`}>
			{tag}
		</ToggleGroupItem>
	{/each}
</ToggleGroup>
