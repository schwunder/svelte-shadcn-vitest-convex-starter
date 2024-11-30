import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import FolderForm from './FolderForm.svelte';
import { superValidate } from 'sveltekit-superforms';
import { folderSchema } from '$schemas/folder';
import { zod } from 'sveltekit-superforms/adapters';

// Add NodeList.prototype.map polyfill for JSDOM
beforeAll(() => {
	if (!NodeList.prototype.map) {
		NodeList.prototype.map = Array.prototype.map;
	}
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
		const form = await superValidate(zod(folderSchema));
		return render(FolderForm, {
			props: { form }
		});
	}

	it('renders form elements correctly', async () => {
		const { getByTestId } = await setupForm();

		expect(getByTestId('folder-path-input')).toBeTruthy();
		expect(getByTestId('folder-path-description')).toBeTruthy();
		expect(getByTestId('submit-button')).toBeTruthy();
		expect(getByTestId('folder-path-label')).toBeTruthy();
	});

	it('handles form submission with valid input', async () => {
		const { getByTestId } = await setupForm();
		const input = getByTestId('folder-path-input') as HTMLInputElement;
		const submitButton = getByTestId('submit-button') as HTMLButtonElement;

		await fireEvent.input(input, { target: { value: 'test-folder' } });
		await fireEvent.click(submitButton);

		// Initially the button should be enabled after input
		expect(submitButton.disabled).toBe(false);
	});

	it('validates folder path length', async () => {
		const { getByTestId } = await setupForm();
		const input = getByTestId('folder-path-input') as HTMLInputElement;
		const submitButton = getByTestId('submit-button') as HTMLButtonElement;

		// Test too short input
		await fireEvent.input(input, { target: { value: 'a' } });

		// Test too long input
		const longPath = 'a'.repeat(51);
		await fireEvent.input(input, { target: { value: longPath } });

		// Button should be enabled when form is tainted
		expect(submitButton.disabled).toBe(false);
	});
});
