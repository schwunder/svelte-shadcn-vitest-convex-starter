import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import SimpleCarousel from './SimpleCarousel.svelte';

// Required for @testing-library/dom's queryAllByLabelText
Object.defineProperty(NodeList.prototype, 'map', {
	value: Array.prototype.map,
	enumerable: false,
	configurable: true,
	writable: true
});

// Mock embla-carousel-svelte
vi.mock('embla-carousel-svelte', () => ({
	default: () => ({
		destroy: vi.fn(),
		scrollNext: vi.fn(),
		scrollPrev: vi.fn(),
		scrollSnapList: () => [0, 1, 2],
		selectedScrollSnap: () => 0,
		on: vi.fn(),
		off: vi.fn()
	})
}));

describe('SimpleCarousel component', () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it('should render with default orientation', () => {
		const { getByLabelText } = render(SimpleCarousel);
		const carousel = getByLabelText('Image Carousel');
		expect(carousel).toBeTruthy();
	});

	it('should render all slides', () => {
		const { getByLabelText } = render(SimpleCarousel);
		expect(getByLabelText('Slide 1')).toBeTruthy();
		expect(getByLabelText('Slide 2')).toBeTruthy();
		expect(getByLabelText('Slide 3')).toBeTruthy();
	});

	it('should change orientation when prop is updated', async () => {
		const { rerender, getByLabelText } = render(SimpleCarousel, {
			orientation: 'horizontal'
		});

		await rerender({ orientation: 'vertical' });
		const carousel = getByLabelText('Image Carousel');
		expect(carousel.getAttribute('aria-orientation')).toBe('vertical');
	});
});
