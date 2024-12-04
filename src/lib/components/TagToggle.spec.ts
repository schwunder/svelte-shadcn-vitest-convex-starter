import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import TagToggle from './TagToggle.svelte';
import { tick } from 'svelte';

// bits-ui's roving focus expects NodeList to have map() available
// This is needed because bits-ui calls map() directly on querySelectorAll results
// See: node_modules/bits-ui/dist/internal/use-roving-focus.svelte.js
// Required for @testing-library/dom's queryAllByLabelText
Object.defineProperty(NodeList.prototype, 'map', {
	value: Array.prototype.map,
	enumerable: false,
	configurable: true,
	writable: true
});

describe('TagToggle', () => {
	it('displays initial tags', async () => {
		const { container } = render(TagToggle, {
			props: {
				selectedTags: ['tag1', 'tag2', 'tag3']
			}
		});

		await tick();

		// Verify structure using data-testid
		const group = container.querySelector('[data-testid="tag-toggle-group"]');
		expect(group).toBeTruthy();
		expect(group?.getAttribute('aria-label')).toBe('Tags');

		// Verify items using data-testid
		const tags = ['tag1', 'tag2', 'tag3'];
		tags.forEach((tag) => {
			const item = container.querySelector(`[data-testid="tag-toggle-${tag}"]`);
			expect(item).toBeTruthy();
			expect(item?.textContent).toBe(tag);
			expect(item?.getAttribute('aria-label')).toBe(`Toggle ${tag}`);
		});
	});
});
