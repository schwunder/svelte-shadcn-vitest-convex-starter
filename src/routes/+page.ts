import type { PageLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { stringInputSchema } from '$schemas';

const schema = zod(stringInputSchema);

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

// TODO: Add proper page load tests
/*
// In-source test suites
if (import.meta.vitest) {
	const { describe, it, expect, vi } = import.meta.vitest;

	describe('Page Load', () => {
		it('should load data from APIs and form', async () => {
			const mockFetch = vi
				.fn()
				.mockResolvedValueOnce({ text: async () => 'OpenAI response' })
				.mockResolvedValueOnce({ text: async () => 'Shell response' });

			const form = await superValidate(schema);
			const data = await load({
				fetch: mockFetch,
				parent: async () => ({}),
				url: new URL('http://localhost'),
				route: { id: '/' },
				params: {},
				data: { form },
				setHeaders: () => {},
				depends: () => {},
				untrack: <T>(fn: () => T) => fn()
			});

			expect(data.openAIData).toBe('OpenAI response');
			expect(data.shellData).toBe('Shell response');
			expect(data.form).toBeDefined();
		});
	});
}
*/
