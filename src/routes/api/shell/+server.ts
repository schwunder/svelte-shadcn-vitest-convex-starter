import { testBunShell } from '$server';

export const GET = async () => {
	const result = await testBunShell();
	return new Response(result);
};
