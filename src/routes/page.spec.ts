import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/svelte';
import Page from './+page.svelte';
import type { SuperValidated } from 'sveltekit-superforms';

// Add NodeList.prototype.map polyfill for JSDOM
beforeAll(() => {
	if (!NodeList.prototype.map) {
		NodeList.prototype.map = Array.prototype.map;
	}
});

// Mock convex-svelte
vi.mock('convex-svelte', () => ({
	useQuery: () => ({
		isLoading: false,
		error: null,
		data: []
	}),
	setupConvex: vi.fn(),
	ConvexProvider: vi.fn()
}));

// Mock components to avoid complex UI interactions
vi.mock('$components', () => ({
	Article: vi.fn(),
	TagToggle: vi.fn(),
	SimpleCarousel: vi.fn(),
	FileCard: vi.fn(),
	StringForm: vi.fn()
}));

describe('Page', () => {
	it('renders', () => {
		const { container } = render(Page, {
			props: {
				data: {
						openAIData: '',
						shellData: '',
						form: {
							id: 'test',
							valid: true,
							posted: false,
							data: { stringInput: '' },
							errors: { _errors: [] }
						} as SuperValidated<{ stringInput: string }>
					}
			}
		});

		expect(container).toBeTruthy();
	});
});
