<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import Counter from '$components/Counter.svelte';
	import Article from '$components/Article.svelte';
	import TagToggle from '$components/TagToggle.svelte';
	import SimpleCarousel from '$components/SimpleCarousel.svelte';
	import FileCard from '$components/FileCard.svelte';
	import FolderForm from '$components/FolderForm.svelte';
	import { add } from '$utilities/math';
	import type { PageData } from './$types';
	import { Toaster } from 'svelte-sonner';

	export let data: PageData;
	const query = useQuery(api.tasks.get, {});
	const result = add(5, 3);
</script>

{#if query.isLoading}
	Loading...
{:else if query.error}
	failed to load: {query.error.toString()}
{:else}
	<p>Result: {result}</p>
	<Counter />
	<Article title="Hello" text="This is a test" />
	<TagToggle />
	<SimpleCarousel orientation="vertical" />
	<FileCard />
	<FolderForm form={data.form} />
	<p>OpenAI says: {data.openAIData}</p>
	<p>Bun shell says: {data.shellData}</p>
	<ul>
		{#each query.data as task}
			<li>
				{task.isCompleted ? '☑' : '☐'}
				<span>{task.text}</span>
				<span>assigned by {task.assigner}</span>
			</li>
		{/each}
	</ul>
{/if}

<Toaster
	richColors={true}
	closeButton={true}
	theme="light"
	position="top-right"
	data-testid="toaster"
/>
