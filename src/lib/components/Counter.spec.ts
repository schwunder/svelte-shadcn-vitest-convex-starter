import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Counter from './Counter.svelte';

describe('Counter', () => {
	it('displays initial count', () => {
		const result = render(Counter);
		expect(result.container.innerHTML).toContain('0');
	});

	it('increments when clicked', async () => {
		const result = render(Counter);
		const button = result.container.querySelector('button');
		if (!button) throw new Error('Button not found');
		await fireEvent.click(button);
		expect(result.container.innerHTML).toContain('1');
	});
});
