import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import LightSwitch from './LightSwitch.svelte';
import { tick } from 'svelte';

// Mock window.matchMedia with proper event listener support
beforeAll(() => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(), // Deprecated

			removeListener: vi.fn(), // Deprecated
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn()
		}))
	});

	// Add NodeList.prototype.map polyfill for JSDOM
	if (!NodeList.prototype.map) {
		NodeList.prototype.map = Array.prototype.map;
	}
});

describe('LightSwitch', () => {
	it('displays theme toggle elements', async () => {
		const { container } = render(LightSwitch);

		await tick();

		// Verify structure
		const button = container.querySelector('[data-testid="theme-toggle-button"]');
		expect(button).toBeTruthy();

		// Verify icons and text
		const elements = ['theme-toggle-sun-icon', 'theme-toggle-moon-icon', 'theme-toggle-text'];

		elements.forEach((elementId) => {
			const element = container.querySelector(`[data-testid="${elementId}"]`);
			expect(element).toBeTruthy();
		});
	});

	it('calls toggleMode when clicked', async () => {
		const { container } = render(LightSwitch);
		const button = container.querySelector('[data-testid="theme-toggle-button"]');

		await fireEvent.click(button!);
		await tick();
	});
});
