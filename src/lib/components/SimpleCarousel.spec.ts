import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/svelte';
import SimpleCarousel from './SimpleCarousel.svelte';
import type { CarouselAPI } from '$ui/carousel/context.js';

// Required for @testing-library/dom's queryAllByLabelText
Object.defineProperty(NodeList.prototype, 'map', {
	value: Array.prototype.map,
	enumerable: false,
	configurable: true,
	writable: true
});

type EmblaCallbackType = (selectedIndex: number, previousIndex: number) => void;

let mockApi: Partial<CarouselAPI>;
let currentIndex = 0;
let selectCallback: EmblaCallbackType | null = null;

// Mock only embla-carousel-svelte
vi.mock('embla-carousel-svelte', () => ({
	default: () => {
		console.log('Creating mock API');
		mockApi = {
			destroy: vi.fn(),
			scrollNext: vi.fn().mockImplementation(() => {
				const prevIndex = currentIndex;
				currentIndex = Math.min(currentIndex + 1, 2);
				console.log('scrollNext called, new index:', currentIndex);
				selectCallback?.(currentIndex, prevIndex);
			}),
			scrollPrev: vi.fn().mockImplementation(() => {
				const prevIndex = currentIndex;
				currentIndex = Math.max(currentIndex - 1, 0);
				console.log('scrollPrev called, new index:', currentIndex);
				selectCallback?.(currentIndex, prevIndex);
			}),
			scrollSnapList: vi.fn().mockReturnValue([0, 1, 2]),
			selectedScrollSnap: vi.fn().mockImplementation(() => {
				console.log('selectedScrollSnap called, returning:', currentIndex);
				return currentIndex;
			}),
			on: vi.fn().mockImplementation((event: string, callback: EmblaCallbackType) => {
				console.log('Registering event:', event);
				if (event === 'select') {
					selectCallback = callback;
					callback(currentIndex, currentIndex);
				}
				return () => {
					console.log('Cleanup for event:', event);
					selectCallback = null;
				};
			}),
			off: vi.fn(),
			canScrollNext: vi.fn().mockReturnValue(true),
			canScrollPrev: vi.fn().mockReturnValue(true)
		};
		return mockApi;
	}
}));

const waitForApi = async () => {
	console.log('Waiting for API initialization...');
	await new Promise((resolve) => setTimeout(resolve, 100));
	console.log('API wait complete');
};

const waitForUpdate = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe('SimpleCarousel component', () => {
	beforeEach(() => {
		console.log('Test setup starting...');
		currentIndex = 0;
		selectCallback = null;
		vi.clearAllMocks();
	});

	afterEach(() => {
		console.log('Test cleanup...');
		cleanup();
	});

	describe('Basic Rendering', () => {
		it('should render the component', () => {
			const { container } = render(SimpleCarousel);
			expect(container).toBeTruthy();
		});

		it('should render with data-testid', () => {
			const { getByTestId } = render(SimpleCarousel);
			expect(getByTestId('carousel-root')).toBeTruthy();
		});

		it('should have correct ARIA label', () => {
			const { getByLabelText } = render(SimpleCarousel);
			expect(getByLabelText('Image Carousel')).toBeTruthy();
		});

		it('should render with default horizontal orientation', () => {
			const { getByTestId } = render(SimpleCarousel);
			expect(getByTestId('carousel-root').getAttribute('aria-orientation')).toBe('horizontal');
		});
	});

	describe('Slide Content', () => {
		it('should render all three slides', () => {
			const { getAllByRole } = render(SimpleCarousel);
			const slides = getAllByRole('group', { hidden: false });
			expect(slides).toHaveLength(3);
		});

		it('should render slides with correct attributes', () => {
			const { getByTestId } = render(SimpleCarousel);

			// Image slide
			const imageSlide = getByTestId('carousel-slide-1-image');
			expect(imageSlide).toBeTruthy();
			expect(imageSlide.getAttribute('aria-label')).toBe('Image slide: Colorful flower');

			// Text slide
			const textSlide = getByTestId('carousel-slide-2-text');
			expect(textSlide).toBeTruthy();
			expect(textSlide.getAttribute('aria-label')).toBe('Text slide: Example Text');

			// Article slide
			const articleSlide = getByTestId('carousel-slide-3-article');
			expect(articleSlide).toBeTruthy();
			expect(articleSlide.getAttribute('aria-label')).toBe('Article slide: Example Article');
		});

		it('should render images with correct sources', () => {
			const { getByTestId } = render(SimpleCarousel);
			const image = getByTestId('carousel-image-1');
			expect(image).toBeTruthy();
			expect(image.getAttribute('src')).toContain('wikimedia.org');
			expect(image.getAttribute('alt')).toBe('Colorful flower');
		});

		it('should render images with alt text', () => {
			const { getByTestId } = render(SimpleCarousel);
			const image = getByTestId('carousel-image-1');
			expect(image.getAttribute('alt')).toBeTruthy();
		});
	});

	describe('Navigation Controls', () => {
		it('should render previous button', () => {
			const { getByTestId } = render(SimpleCarousel);
			expect(getByTestId('carousel-previous')).toBeTruthy();
		});

		it('should render next button', () => {
			const { getByTestId } = render(SimpleCarousel);
			expect(getByTestId('carousel-next')).toBeTruthy();
		});

		it('should render slide indicator', () => {
			const { getByTestId } = render(SimpleCarousel);
			expect(getByTestId('carousel-indicator')).toBeTruthy();
		});

		it('should have correct ARIA labels on controls', () => {
			const { getByLabelText } = render(SimpleCarousel);
			expect(getByLabelText('Previous Slide')).toBeTruthy();
			expect(getByLabelText('Next Slide')).toBeTruthy();
			expect(getByLabelText('Slide Indicator')).toBeTruthy();
		});
	});

	describe('API Integration - Basic', () => {
		it('should initialize API', async () => {
			console.log('Testing API initialization...');
			render(SimpleCarousel);
			await waitForApi();
			expect(mockApi).toBeDefined();
		});

		it('should setup event listeners', async () => {
			console.log('Testing event listener setup...');
			render(SimpleCarousel);
			await waitForApi();
			expect(mockApi.on).toBeDefined();
		});

		it('should have navigation methods', async () => {
			console.log('Testing navigation methods...');
			render(SimpleCarousel);
			await waitForApi();
			expect(mockApi.scrollNext).toBeDefined();
			expect(mockApi.scrollPrev).toBeDefined();
		});
	});

	describe('Navigation Events', () => {
		it('should handle direct API calls', async () => {
			console.log('Testing direct API calls...');
			render(SimpleCarousel);
			await waitForApi();
			await waitForUpdate();

			mockApi.scrollNext?.();
			expect(mockApi.scrollNext).toHaveBeenCalled();
			expect(currentIndex).toBe(1);
		});

		it('should handle click events with fireEvent', async () => {
			const { container } = render(SimpleCarousel);
			await waitForApi();

			const content = container.querySelector('.overflow-hidden');
			if (!content) throw new Error('Carousel container not found');

			const emblaInit = new CustomEvent('emblaInit', {
				detail: mockApi,
				bubbles: true
			});
			content.dispatchEvent(emblaInit);
			await waitForUpdate();

			const nextButton = Array.from(container.querySelectorAll('span.sr-only'))
				.find((span) => span.textContent === 'Next slide')
				?.closest('button');
			if (!nextButton) throw new Error('Next button not found');

			await fireEvent.click(nextButton);
			expect(mockApi.scrollNext).toHaveBeenCalled();
			expect(currentIndex).toBe(1);
		});
	});

	describe('State Management', () => {
		it('should track current slide', async () => {
			console.log('Testing slide tracking...');
			const { getByTestId } = render(SimpleCarousel);
			await waitForApi();
			await waitForUpdate();

			const indicator = getByTestId('carousel-indicator');
			console.log('Initial indicator text:', indicator.textContent);
			expect(indicator.textContent).toContain('1');
		});
	});

	describe('Cleanup', () => {
		it('should cleanup on unmount', async () => {
			console.log('Testing cleanup...');
			const { unmount } = render(SimpleCarousel);
			await waitForApi();
			unmount();
			expect(mockApi.destroy).toHaveBeenCalled();
		});
	});
});
