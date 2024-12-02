import { testBunShell } from '$server';

export const GET = async () => {
	await testBunShell();
	return new Response('Hello from Bun shell!');
};
