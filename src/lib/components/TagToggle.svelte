<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '$ui/toggle-group';

	let { tags = ['tag1', 'tag2', 'tag3'], selectedTags = [] } = $props<{
		tags?: string[];
		selectedTags?: string[];
	}>();
</script>

<ToggleGroup
	type="multiple"
	bind:value={selectedTags}
	aria-label="Tags"
	data-testid="tag-toggle-group"
>
	{#each tags as tag}
		<ToggleGroupItem value={tag} aria-label={`Toggle ${tag}`} data-testid={`tag-toggle-${tag}`}>
			{tag}
		</ToggleGroupItem>
	{/each}
</ToggleGroup>
