import { callCompletionsApi } from '$server';

export const GET = async () => {
	const response = await callCompletionsApi();
	return new Response(response);
};

// In-source test suites
if (import.meta.vitest) {
	const { describe, it, expect, vi } = import.meta.vitest;

	describe('OpenAI API Endpoint', () => {
		it('should return a Response object', async () => {
			vi.mock('openai', () => ({
				default: class MockOpenAI {
					constructor() {
						return {
							chat: {
								completions: {
									create: vi.fn().mockResolvedValue({
										choices: [{ message: { content: 'This is a mocked response' } }]
									})
								}
							}
						};
					}
				}
			}));

			const response = await GET();
			expect(response).toBeInstanceOf(Response);
			expect(await response.text()).toBe('This is a mocked response');
		});
	});
}
