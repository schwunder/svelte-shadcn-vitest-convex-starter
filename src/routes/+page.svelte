<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import { Counter, Article, TagToggle, SimpleCarousel, FileCard, FolderForm } from '$components';
	import { add } from '$utilities';
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
	<TagToggle tags={['Frontend', 'Backend', 'Full-Stack']} selectedTags={['Frontend']} />
	<SimpleCarousel orientation="vertical" />
	<FileCard
		cardTitle="Deploy Your Project"
		cardDescription="Configure your deployment settings"
		inputLabel="Project Name"
		inputPlaceholder="Enter your project name"
		checkboxLabel="Enable Framework Detection"
		checked={false}
		onCancel={() => {
			console.log('Cancelled deployment');
		}}
		onDeploy={() => {
			console.log('Starting deployment');
		}}
	/>
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
