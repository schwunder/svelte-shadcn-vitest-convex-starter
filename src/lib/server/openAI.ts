import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export const callCompletionsApi = async () => {
	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'user',
					content: [
						{ type: 'text', text: "What's in this image?" },
						{
							type: 'image_url',
							image_url: {
								url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg'
							}
						}
					]
				}
			]
		});

		if (!response.choices[0]?.message?.content) {
			throw new Error('No content in OpenAI response');
		}

		return response.choices[0].message.content;
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		throw new Error(errorMessage);
	}
};

// Tests
if (import.meta.vitest) {
	const { describe, it, expect, vi } = import.meta.vitest;

	const mockResponses = {
		success: {
			choices: [
				{
					message: {
						role: 'assistant',
						content: 'This is a mocked response'
					}
				}
			]
		},
		error: {
			choices: [
				{
					message: {
						role: 'assistant',
						content: null
					}
				}
			]
		}
	};

	describe('OpenAI API', () => {
		beforeEach(async () => {
			vi.resetModules();
			vi.clearAllMocks();
			vi.unstubAllGlobals();
		});

		it('should return content from response', async () => {
			vi.doMock('openai', () => ({
				default: class MockOpenAI {
					constructor() {
						return {
							chat: {
								completions: {
									create: vi.fn().mockResolvedValue(mockResponses.success)
								}
							}
						};
					}
				}
			}));

			const { callCompletionsApi } = await import('./openAI');
			const result = await callCompletionsApi();
			expect(result).toBe('This is a mocked response');
		});

		it('should throw when no content in response', async () => {
			vi.doMock('openai', () => ({
				default: class MockOpenAI {
					constructor() {
						return {
							chat: {
								completions: {
									create: vi.fn().mockResolvedValue(mockResponses.error)
								}
							}
						};
					}
				}
			}));

			const { callCompletionsApi } = await import('./openAI');
			await expect(callCompletionsApi()).rejects.toThrow('No content in OpenAI response');
		});
	});
}
