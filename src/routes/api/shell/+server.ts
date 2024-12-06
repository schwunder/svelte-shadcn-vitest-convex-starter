import { testBunShell } from '$server';

export const GET = async () => {
	const result = await testBunShell();
	return new Response(result);
};

// In-source test suites
if (import.meta.vitest) {
	const { describe, it, expect, vi } = import.meta.vitest;

	describe('Shell API Endpoint', () => {
		it('should return a Response object with correct content', async () => {
			vi.mock('$server', () => ({
				testBunShell: vi.fn().mockResolvedValue('Shell command executed')
			}));

			const response = await GET();
			expect(response).toBeInstanceOf(Response);
			expect(await response.text()).toBe('Shell command executed');
		});
	});
}
