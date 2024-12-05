import { describe, it, expect, afterEach, vi, beforeAll } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import FileCard from './FileCard.svelte';

// Add type declaration for the map method
declare global {
	interface NodeList {
		map<T>(callbackfn: (value: Node, index: number, array: Node[]) => T): T[];
	}
}

// Add NodeList.prototype.map polyfill for JSDOM
beforeAll(() => {
	if (!NodeList.prototype.map) {
		NodeList.prototype.map = Array.prototype.map;
	}
});

describe('FileCard', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders card with all sections and content', () => {
		const { getByTestId, getByText } = render(FileCard, {
			props: {
				cardTitle: 'Test Project',
				cardDescription: 'Test project description',
				inputLabel: 'Project Name',
				inputPlaceholder: 'Enter project name',
				checkboxLabel: 'Enable Framework Selection',
				checked: true
			}
		});

		// Check main structure using data-testid
		expect(getByTestId('file-card')).toBeTruthy();
		expect(getByTestId('file-card-header')).toBeTruthy();
		expect(getByTestId('file-card-content')).toBeTruthy();
		expect(getByTestId('file-card-footer')).toBeTruthy();
		expect(getByTestId('card-title')).toBeTruthy();
		expect(getByTestId('card-description')).toBeTruthy();

		// Check ARIA labels
		expect(getByTestId('file-card').getAttribute('aria-label')).toBe('File Card');
		expect(getByTestId('card-title').getAttribute('aria-label')).toBe('Card Title');
		expect(getByTestId('card-description').getAttribute('aria-label')).toBe('Card Description');

		// Check content
		expect(getByText('Test Project')).toBeTruthy();
		expect(getByText('Test project description')).toBeTruthy();
	});

	it('handles input changes', async () => {
		const { getByTestId } = render(FileCard, {
			props: {
				inputLabel: 'Project Name',
				inputPlaceholder: 'Enter project name'
			}
		});

		const input = getByTestId('name-input') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'New Project' } });
		expect(input.value).toBe('New Project');
	});

	it('handles checkbox state', async () => {
		const { getByTestId } = render(FileCard, {
			props: {
				checkboxLabel: 'Enable Framework Selection',
				checked: false
			}
		});

		const checkbox = getByTestId('framework-checkbox');
		await fireEvent.click(checkbox);
		expect(checkbox.getAttribute('aria-checked')).toBe('true');
	});

	it('handles button clicks', async () => {
		const handleCancel = vi.fn();
		const handleDeploy = vi.fn();

		const { getByTestId } = render(FileCard, {
			props: {
				onCancel: handleCancel,
				onDeploy: handleDeploy
			}
		});

		await fireEvent.click(getByTestId('cancel-button'));
		expect(handleCancel).toHaveBeenCalled();

		await fireEvent.click(getByTestId('deploy-button'));
		expect(handleDeploy).toHaveBeenCalled();
	});

	// New test case
	it('renders card header with custom content', () => {
		const { getByTestId, getByLabelText } = render(FileCard, {
			props: {
				cardTitle: 'Custom Title',
				cardDescription: 'Custom Description',
				inputLabel: 'Custom Label'
			}
		});

		const header = getByTestId('file-card-header');
		const label = getByLabelText('Custom Label');

		expect(header.textContent).toContain('Custom Title');
		expect(header.textContent).toContain('Custom Description');
		expect(label).toBeTruthy();
	});

	it('handles deploy button click with input value', async () => {
		const handleDeploy = vi.fn();
		const { getByTestId } = render(FileCard, {
			props: {
				onDeploy: handleDeploy,
				inputLabel: 'Project Name',
				inputPlaceholder: 'Enter project name'
			}
		});

		const input = getByTestId('name-input') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'Test Project' } });
		await fireEvent.click(getByTestId('deploy-button'));

		expect(handleDeploy).toHaveBeenCalled();
	});
});
