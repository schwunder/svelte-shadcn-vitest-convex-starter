import { flushSync, mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Counter from './Counter.svelte';

test('Counter component', () => {
	// Mount the component
	const component = mount(Counter, {
		target: document.body,
		props: { count: 0 }
	});

	// Check initial state
	expect(document.body.innerHTML).toContain('<button>0</button>');

	// Simulate a button click
	const button = document.querySelector('button');
	button?.click();
	flushSync();

	// Check updated state
	expect(document.body.innerHTML).toContain('<button>1</button>');

	// Unmount the component
	unmount(component);
});
