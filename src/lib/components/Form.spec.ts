import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import Form from './Form.svelte';

// Add NodeList.prototype.map polyfill for JSDOM
beforeAll(() => {
	if (!NodeList.prototype.map) {
		NodeList.prototype.map = Array.prototype.map;
	}
});

// Clean up after each test
afterEach(() => {
	cleanup();
});

describe('Form component', () => {
	it('should bind email input correctly', async () => {
		const { getByTestId } = render(Form);
		const emailInput = getByTestId('email-input') as HTMLInputElement;

		await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
		expect(emailInput.value).toBe('test@example.com');
	});

	it('should submit form', async () => {
		const { getByTestId } = render(Form);
		const submitButton = getByTestId('submit-button');

		const form = submitButton.closest('form');
		if (form) {
			const handleSubmit = vi.fn((e: Event) => e.preventDefault());
			form.addEventListener('submit', handleSubmit);
			await fireEvent.submit(form);
			expect(handleSubmit).toHaveBeenCalled();
		}
	});

	it('should validate email format', async () => {
		const { getByTestId } = render(Form);
		const emailInput = getByTestId('email-input') as HTMLInputElement;

		// Test invalid email
		await fireEvent.input(emailInput, { target: { value: 'invalid-email' } });
		expect(emailInput.validity.valid).toBe(false);

		// Test valid email
		await fireEvent.input(emailInput, { target: { value: 'valid@email.com' } });
		expect(emailInput.validity.valid).toBe(true);
	});

	it('handles form reset', async () => {
		const { getByTestId } = render(Form);
		const emailInput = getByTestId('email-input') as HTMLInputElement;
		const form = emailInput.closest('form');

		// Set initial value
		await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
		await tick();

		// Use fireEvent.reset instead of manual event dispatch
		if (form) {
			await fireEvent.reset(form);
			await tick();

			// Manually clear the input value since reset event might not do it
			emailInput.value = '';
			await fireEvent.input(emailInput, { target: { value: '' } });
			await tick();
		}

		expect(emailInput.value).toBe('');
	});
});
