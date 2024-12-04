import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import Counter from './Counter.svelte';

afterEach(() => {
	cleanup();
});

describe('Counter', () => {
	it('displays initial count', () => {
		const result = render(Counter);
		const button = result.container.querySelector('[data-testid="counter"]');
		expect(button?.textContent?.trim()).toBe('0');
	});

	it('increments when clicked', async () => {
		const result = render(Counter);
		const button = result.container.querySelector('[data-testid="counter"]');
		if (!button) throw new Error('Button not found');
		await fireEvent.click(button);
		expect(button.textContent?.trim()).toBe('1');
	});

	it('has correct button styles and attributes', () => {
		const { container } = render(Counter);
		const button = container.querySelector('[data-testid="counter"]');

		// Check for shadcn-svelte button classes
		expect(button?.classList.contains('bg-primary')).toBe(true);
		expect(button?.classList.contains('text-primary-foreground')).toBe(true);
		expect(button?.classList.contains('hover:bg-primary/90')).toBe(true);
		expect(button?.getAttribute('aria-label')).toBe('Counter');
		expect(button?.getAttribute('data-testid')).toBe('counter');
	});

	it('handles multiple clicks', async () => {
		const { container } = render(Counter);
		const button = container.querySelector('[data-testid="counter"]');
		if (!button) throw new Error('Button not found');

		await fireEvent.click(button);
		await fireEvent.click(button);
		await fireEvent.click(button);

		expect(button.textContent?.trim()).toBe('3');
	});
});
