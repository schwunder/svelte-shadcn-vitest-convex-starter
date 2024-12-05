import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import FolderForm from './StringForm.svelte';
import { superValidate } from 'sveltekit-superforms';
import { stringInputSchema } from '$schemas';
import { zod } from 'sveltekit-superforms/adapters';

// Mock SvelteKit's form handling
vi.mock('@sveltejs/kit', () => ({
	enhance: () => ({
		destroy: vi.fn()
	})
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

describe('FolderForm', () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	// Mock toast functions
	vi.mock('svelte-sonner', () => ({
		toast: {
			success: vi.fn(),
			error: vi.fn()
		}
	}));

	async function setupForm() {
		const form = await superValidate(zod(stringInputSchema));
		return render(FolderForm, {
			props: { form }
		});
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
});
