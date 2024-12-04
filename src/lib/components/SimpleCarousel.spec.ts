import { describe, it, expect, vi, afterEach } from 'vitest';
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
		const { getByTestId } = render(SimpleCarousel);
		const carousel = getByTestId('carousel-root');
		expect(carousel).toBeTruthy();
		expect(carousel.getAttribute('aria-label')).toBe('Image Carousel');
	});

	it('should render all slides', () => {
		const { getByTestId } = render(SimpleCarousel);
		expect(getByTestId('carousel-slide-1')).toBeTruthy();
		expect(getByTestId('carousel-slide-2')).toBeTruthy();
		expect(getByTestId('carousel-slide-3')).toBeTruthy();
	});

	it('should change orientation when prop is updated', async () => {
		const { rerender, getByLabelText } = render(SimpleCarousel, {
			orientation: 'horizontal'
		});

		await rerender({ orientation: 'vertical' });
		const carousel = getByLabelText('Image Carousel');
		expect(carousel.getAttribute('aria-orientation')).toBe('vertical');
	});

	it('should have correct navigation controls', () => {
		const { getByTestId } = render(SimpleCarousel);

		const prevButton = getByTestId('carousel-previous');
		const nextButton = getByTestId('carousel-next');
		const indicator = getByTestId('carousel-indicator');

		expect(prevButton.getAttribute('aria-label')).toBe('Previous Slide');
		expect(nextButton.getAttribute('aria-label')).toBe('Next Slide');
		expect(indicator.getAttribute('aria-label')).toBe('Slide Indicator');
	});

	it('displays correct slide indicator', () => {
		const { getByTestId } = render(SimpleCarousel);
		const indicator = getByTestId('carousel-indicator');

		expect(indicator.getAttribute('aria-label')).toBe('Slide Indicator');
		expect(indicator.textContent).toContain('0 / 0');
	});
});
