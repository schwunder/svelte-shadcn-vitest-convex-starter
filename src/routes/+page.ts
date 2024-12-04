import type { PageLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { folderSchema } from '$schemas';

// Define schema at module level for caching
const schema = zod(folderSchema);

export const load = (async ({ fetch }) => {
	const form = await superValidate(schema);
	const openAIResponse = await fetch('/api/open-ai');
	const openAIData = await openAIResponse.text();
	const shellResponse = await fetch('/api/shell');
	const shellData = await shellResponse.text();

	return {
		openAIData,
		shellData,
		form
	};
}) satisfies PageLoad;
