import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createStringInputSchema,  type StringInputConfig } from '$schemas';

// Define config at module level
const formConfig: StringInputConfig = {
	minLength: 2,
	maxLength: 50,
	label: 'Custom Input',
	placeholder: 'Enter your text'
};

const schema = zod(createStringInputSchema(formConfig));

export const load = (async () => {
	const form = await superValidate(schema);
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema);
		console.log('POST', form);

		if (!form.valid) {
			return fail(400, { form });
		}

		return { form };
	}
} satisfies Actions;
