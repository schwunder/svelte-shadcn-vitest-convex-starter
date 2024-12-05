<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import { Article, TagToggle, SimpleCarousel, FileCard, StringForm } from '$components';
	import { add } from '$utilities';
	import type { PageData } from './$types';

	export let data: PageData;
	const query = useQuery(api.tasks.get, {});
	const result = add(5, 3);
</script>

{#if query.isLoading}
	Loading...
{:else if query.error}
	failed to load: {query.error.toString()}
{:else}
	<ul>
		{#each query.data as task}
			<li>
				{task.isCompleted ? '☑' : '☐'}
				<span>{task.text}</span>
				<span>assigned by {task.assigner}</span>
			</li>
		{/each}
	</ul>
	<Article
		title={`Hello ${result}`}
		text={`Open AI says ${data.openAIData} and Bun shell says ${data.shellData}`}
	/>
	<StringForm
		form={data.form}
		config={{
			label: 'Custom Label',
			placeholder: 'Custom Placeholder',
			minLength: 2,
			maxLength: 50,
			successMessage: 'Custom success message',
			errorMessage: 'Custom error message'
		}}
	/>
	<TagToggle tags={['Frontend', 'Backend', 'Full-Stack']} selectedTags={['Frontend']} />
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

	<SimpleCarousel orientation="vertical" />
{/if}
