<script lang="ts">
	import * as Carousel from '$ui/carousel/index.js';
	import type { CarouselAPI } from '$ui/carousel/context.js';

	let { orientation = 'horizontal' } = $props<{
		orientation?: 'horizontal' | 'vertical';
	}>();

	let api = $state<CarouselAPI>();
	let current = $state(0);
	const count = $derived(api ? api.scrollSnapList().length : 0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	function handlePrevious(event: MouseEvent) {
		api?.scrollPrev();
	}

	function handleNext(event: MouseEvent) {
		api?.scrollNext();
	}
</script>

<Carousel.Root
	setApi={(emblaApi) => (api = emblaApi)}
	{orientation}
	aria-label="Image Carousel"
	aria-orientation={orientation}
	data-testid="carousel-root"
	opts={{
		align: 'center',
		loop: true,
		skipSnaps: false,
		containScroll: 'trimSnaps'
	}}
>
	<div data-testid="carousel-container">
		<Carousel.Content aria-label="Carousel Content" data-testid="carousel-content">
			<Carousel.Item aria-label="Slide 1" data-testid="carousel-slide-1">
				<div>Slide 1</div>
			</Carousel.Item>
			<Carousel.Item aria-label="Slide 2" data-testid="carousel-slide-2">
				<div>Slide 2</div>
			</Carousel.Item>
			<Carousel.Item aria-label="Slide 3" data-testid="carousel-slide-3">
				<div>Slide 3</div>
			</Carousel.Item>
		</Carousel.Content>
	</div>

	<div data-testid="carousel-controls">
		<Carousel.Previous
			aria-label="Previous Slide"
			onclick={handlePrevious}
			data-testid="carousel-previous"
		/>
		<div aria-label="Slide Indicator" data-testid="carousel-indicator">
			{current} / {count}
		</div>
		<Carousel.Next aria-label="Next Slide" onclick={handleNext} data-testid="carousel-next" />
	</div>
</Carousel.Root>

<style>
	:global([data-embla-slide]) {
		flex: 0 0 100%;
		min-width: 0;
	}
</style>
