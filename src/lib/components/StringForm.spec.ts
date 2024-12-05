import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import StringForm from './StringForm.svelte';
import { superValidate } from 'sveltekit-superforms';
import type { SuperValidated, Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { stringInputSchema, type StringInputConfig } from '$lib/schemas';
import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

// Define types for enhance function parameters
type EnhanceCallback = {
	onUpdated: (result: {
		type: 'success' | 'failure';
		status: number;
		data: { stringInput: string };
	}) => Promise<void>;
};

// Add NodeList.prototype.map polyfill for JSDOM
if (!NodeList.prototype.map) {
	NodeList.prototype.map = Array.prototype.map;
}

// Configure vitest to use fake timers
vi.useFakeTimers();

// Mock SvelteKit's form handling with proper result handling
vi.mock('@sveltejs/kit', () => ({
	enhance: (form: HTMLFormElement, { onUpdated }: EnhanceCallback) => {
		form.onsubmit = async (event) => {
			event.preventDefault();
			const stringInput = (form.elements.namedItem('stringInput') as HTMLInputElement)?.value || '';

			// Simulate validation and return result with message
			if (stringInput.length >= 2) {
				await onUpdated({
					type: 'success',
					status: 200,
					data: { stringInput }
				});
			} else {
				await onUpdated({
					type: 'failure',
					status: 400,
					data: { stringInput }
				});
			}
			return false;
		};
		return { destroy: vi.fn() };
	},
	applyAction: vi.fn(),
	invalidateAll: vi.fn()
}));

// Mock toast with proper implementation
vi.mock('svelte-sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn()
	}
}));

// Mock browser environment
beforeAll(() => {
	if (!NodeList.prototype.map) {
		NodeList.prototype.map = Array.prototype.map;
	}

	// Mock window.location
	Object.defineProperty(window, 'location', {
		value: { pathname: '/' },
		writable: true
	});
});

describe('StringForm', () => {
	let form: SuperValidated<Infer<typeof stringInputSchema>>;

	beforeAll(async () => {
		form = await superValidate(zod(stringInputSchema));
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
		vi.clearAllTimers();
	});

	async function setupForm(customConfig: Partial<StringInputConfig> = {}) {
		console.log('Setting up form with config:', customConfig);

		const { container, getByTestId, component } = render(StringForm, {
			props: {
				form,
				config: customConfig
			}
		});

		// Add SuperDebug for debugging
		const debugContainer = document.createElement('div');
		container.appendChild(debugContainer);
		render(SuperDebug, {
			props: { data: form },
			target: debugContainer
		});

		return { container, getByTestId, component, form };
	}

	it('renders form elements correctly', async () => {
		const { getByTestId } = await setupForm();

		expect(getByTestId('string-input')).toBeTruthy();
		expect(getByTestId('string-input-description')).toBeTruthy();
		expect(getByTestId('submit-button')).toBeTruthy();
		expect(getByTestId('string-input-label')).toBeTruthy();
	});

	it('updates input value correctly', async () => {
		const { getByTestId } = await setupForm();
		const input = getByTestId('string-input') as HTMLInputElement;

		await fireEvent.input(input, { target: { value: 'test-string' } });
		expect(input.value).toBe('test-string');
	});

	it('enables submit button when form is tainted', async () => {
		const { getByTestId } = await setupForm();
		const input = getByTestId('string-input') as HTMLInputElement;
		const submitButton = getByTestId('submit-button') as HTMLButtonElement;

		// Initially button should be disabled
		expect(submitButton.disabled).toBe(true);

		// After input, button should be enabled
		await fireEvent.input(input, { target: { value: 'test-string' } });
		expect(submitButton.disabled).toBe(false);
	});

	it('has correct ARIA labels', async () => {
		const { getByTestId } = await setupForm();

		expect(getByTestId('string-input-form').getAttribute('aria-label')).toBe('String Input Form');
		expect(getByTestId('string-input').getAttribute('aria-label')).toBe('String Input');
		expect(getByTestId('string-input-label').getAttribute('aria-label')).toBe('String Input Label');
		expect(getByTestId('string-input-description').getAttribute('aria-label')).toBe(
			'String Input Description'
		);
	});

	it('displays description text correctly', async () => {
		const { getByTestId } = await setupForm();
		const description = getByTestId('string-input-description');

		expect(description.textContent).toBe('Enter a string input between 2 and 50 characters.');
	});

	it('handles form reset', async () => {
		const { getByTestId } = await setupForm();
		const input = getByTestId('string-input') as HTMLInputElement;
		const form = getByTestId('string-input-form');

		// Set initial value
		await fireEvent.input(input, { target: { value: 'test-string' } });
		expect(input.value).toBe('test-string');

		// Reset the form
		await fireEvent.reset(form);
		await fireEvent.input(input, { target: { value: '' } });
		expect(input.value).toBe('');
	});

	// TODO: Fix these tests
	/*
	it('displays custom success message', async () => {
		const { getByTestId } = await setupForm({
			successMessage: 'Custom success message'
		});

		const input = getByTestId('string-input') as HTMLInputElement;
		const submitButton = getByTestId('submit-button');

		// Type valid input
		await fireEvent.input(input, { target: { value: 'valid-input' } });
		await tick();

		// Submit form
		await fireEvent.click(submitButton);
		
		// Use multiple ticks to ensure all async operations complete
		await tick();
		await tick();
		await tick();

		expect(toast.success).toHaveBeenCalledWith('Custom success message');
	});

	it('displays custom error message', async () => {
		const { getByTestId } = await setupForm({
			errorMessage: 'Custom error message'
		});

		const input = getByTestId('string-input') as HTMLInputElement;
		const submitButton = getByTestId('submit-button');

		// Type invalid input (single character)
		await fireEvent.input(input, { target: { value: 'a' } });
		await tick();

		// Submit form
		await fireEvent.click(submitButton);
		
		// Use multiple ticks to ensure all async operations complete
		await tick();
		await tick();
		await tick();

		expect(toast.error).toHaveBeenCalledWith('Custom error message');
	});
	*/
});
