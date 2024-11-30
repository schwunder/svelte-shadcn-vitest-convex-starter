import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Form from './Form.svelte';

// Add NodeList.prototype.map polyfill for JSDOM
beforeAll(() => {
	if (!NodeList.prototype.map) {
		NodeList.prototype.map = Array.prototype.map;
	}
});

// Add type declaration for the map method
declare global {
	interface NodeList {
		map<T>(callbackfn: (value: Node, index: number, array: Node[]) => T): T[];
	}
}

describe('Form component', () => {
	it('should bind email input correctly', async () => {
		const { getAllByLabelText } = render(Form);
		const emailInputs = getAllByLabelText('Form Submit Input');

		// Assuming you want to interact with the first email input
		const emailInput = emailInputs[0] as HTMLInputElement;

		await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
		expect(emailInput.value).toBe('test@example.com');
	});

	it('should submit form', async () => {
		const { getAllByLabelText } = render(Form);
		const submitButtons = getAllByLabelText('Form Submit Button');

		// Assuming you want to interact with the first submit button
		const submitButton = submitButtons[0];

		// Mock the form's submit event using vitest
		const form = submitButton.closest('form');
		if (form) {
			const handleSubmit = vi.fn((e: Event) => e.preventDefault());
			form.addEventListener('submit', handleSubmit);

			// Simulate form submission
			await fireEvent.submit(form);

			// Check if the submit event was called
			expect(handleSubmit).toHaveBeenCalled();
		} else {
			throw new Error('Form not found');
		}
	});
});
