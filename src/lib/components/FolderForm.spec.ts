import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import FolderForm from './FolderForm.svelte';
import { superValidate } from 'sveltekit-superforms';
import { folderSchema } from '$schemas/folder';
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

	it('updates input value correctly', async () => {
		const { getByTestId } = await setupForm();
		const input = getByTestId('folder-path-input') as HTMLInputElement;

		await fireEvent.input(input, { target: { value: 'test-folder' } });
		expect(input.value).toBe('test-folder');
	});

	it('enables submit button when form is tainted', async () => {
		const { getByTestId } = await setupForm();
		const input = getByTestId('folder-path-input') as HTMLInputElement;
		const submitButton = getByTestId('submit-button') as HTMLButtonElement;

		// Initially button should be disabled
		expect(submitButton.disabled).toBe(true);

		// After input, button should be enabled
		await fireEvent.input(input, { target: { value: 'test-folder' } });
		expect(submitButton.disabled).toBe(false);
	});
});
