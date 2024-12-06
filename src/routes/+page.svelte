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

	<SimpleCarousel
		orientation="horizontal"
		loop={false}
		align="start"
		skipSnaps={true}
		dragFree={true}
		containScroll="trimSnaps"
		dragThreshold={10}
		startIndex={1}
		spacing="4"
		slideSpacing="2"
		buttonOffset="8"
		aspectRatio="video"
		direction="ltr"
		inViewThreshold={0.5}
		breakpoints={{
			'(max-width: 768px)': {
				dragFree: true,
				containScroll: 'keepSnaps'
			}
		}}
		slides={[
			{
				type: 'image',
				src: 'https://picsum.photos/1200/675', // 16:9 ratio image
				alt: 'Random landscape image'
			},
			{
				type: 'text',
				title: 'Mobile-First Design',
				content: 'Responsive layout with touch-friendly navigation and smooth scrolling.'
			},
			{
				type: 'article',
				title: 'Feature Overview',
				content:
					'This carousel demonstrates advanced features including drag-free scrolling, responsive breakpoints, and mixed content types.',
				author: 'Design Team'
			},
			{
				type: 'image',
				src: 'https://picsum.photos/1200/675?random=2',
				alt: 'Another random landscape'
			}
		]}
	/>
{/if}
