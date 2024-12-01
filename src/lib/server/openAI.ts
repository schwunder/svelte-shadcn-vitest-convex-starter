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
		console.error('OpenAI API Error:', error);
		throw new Error(errorMessage);
	}
};
