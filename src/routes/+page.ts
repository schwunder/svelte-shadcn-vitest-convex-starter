import type { PageLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { folderSchema } from '$schemas/folder';

// Define schema at module level for caching
const schema = zod(folderSchema);

export const load = (async () => {
	const form = await superValidate(schema);
	return { form };
}) satisfies PageLoad;
