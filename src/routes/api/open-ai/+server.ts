import { callCompletionsApi } from '$server';

export const GET = async () => {
	const response = await callCompletionsApi();
	return new Response(response);
};
