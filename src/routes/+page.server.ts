import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createStringInputSchema, type StringInputConfig } from '$schemas';

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
		if (!form.valid) {
			return fail(400, { form });
		}
		return { form };
	}
} satisfies Actions;

// TODO: Add proper page actions tests
/*
// In-source test suites
if (import.meta.vitest) {
	const { describe, it, expect, vi } = import.meta.vitest;

	describe('Page Server', () => {
		it('should load form data', async () => {
			const data = await load();
			expect(data.form).toBeDefined();
			expect(data.form.valid).toBe(true);
		});

		it('should handle form submission', async () => {
			const mockRequest = new Request('http://localhost', {
				method: 'POST',
				body: new URLSearchParams({ stringInput: 'test' })
			});

			const mockEvent = {
				request: mockRequest,
				cookies: {
					get: () => undefined,
					getAll: () => [{ name: 'test', value: 'test' }],
					set: () => {},
					delete: () => {},
					serialize: () => ''
				},
				fetch: vi.fn(),
				getClientAddress: () => '127.0.0.1',
				locals: {},
				params: {},
				platform: {},
				route: { id: '/' },
				setHeaders: () => {},
				url: new URL('http://localhost'),
				isDataRequest: false,
				isSubRequest: false
			} satisfies RequestEvent;

			const result = await actions.default(mockEvent);
			expect(result).toHaveProperty('form');
		});
	});
}
*/
