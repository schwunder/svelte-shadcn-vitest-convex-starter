<script lang="ts">
	import * as Carousel from '$ui/carousel';
	import type { CarouselAPI, CarouselOptions } from '$ui/carousel/context.js';

	type ImageSlide = {
		type: 'image';
		src: string;
		alt: string;
	};

	type TextSlide = {
		type: 'text';
		content: string;
		title?: string;
	};

	type ArticleSlide = {
		type: 'article';
		title: string;
		content: string;
		author?: string;
	};

	type CarouselSlide = ImageSlide | TextSlide | ArticleSlide;

	let {
		orientation = 'horizontal',
		loop = true,
		align = 'center',
		skipSnaps = false,
		dragFree = false,
		containScroll = 'trimSnaps',
		dragThreshold = 10,
		startIndex = 0,
		direction = 'ltr',
		inViewThreshold = 0,
		breakpoints = {},

		spacing = '14',
		slideSpacing = '4',
		buttonOffset = '12',
		aspectRatio = 'square',

		slides = [
			{
				type: 'image',
				src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/JPEG_example_flower.jpg/800px-JPEG_example_flower.jpg',
				alt: 'Colorful flower'
			},
			{
				type: 'text',
				title: 'Example Text',
				content: 'This is an example text slide.'
			},
			{
				type: 'article',
				title: 'Example Article',
				content: 'This is an example article with more detailed content.',
				author: 'John Doe'
			}
		]
	} = $props<{
		orientation?: 'horizontal' | 'vertical';
		loop?: boolean;
		align?: 'start' | 'center' | 'end';
		skipSnaps?: boolean;
		dragFree?: boolean;
		containScroll?: '' | 'trimSnaps' | 'keepSnaps';
		dragThreshold?: number;
		startIndex?: number;
		direction?: 'ltr' | 'rtl';
		inViewThreshold?: number;
		breakpoints?: Record<string, Partial<CarouselOptions>>;

		spacing?: string;
		slideSpacing?: string;
		buttonOffset?: string;
		aspectRatio?: 'square' | 'video' | 'portrait';

		slides?: CarouselSlide[];
	}>();

	let api = $state<CarouselAPI>();
	let current = $state(startIndex);
	const count = $derived(api ? api.scrollSnapList().length : 0);

	$effect(() => {
		if (!api) return;
		current = api.selectedScrollSnap();
		api.on('select', () => {
			if (!api) return;
			current = api.selectedScrollSnap();
		});
	});
</script>

<Carousel.Root
	setApi={(emblaApi) => (api = emblaApi)}
	{orientation}
	aria-label="Image Carousel"
	aria-orientation={orientation}
	data-testid="carousel-root"
	opts={{
		align,
		loop,
		skipSnaps,
		dragFree,
		containScroll,
		dragThreshold,
		startIndex,
		direction,
		inViewThreshold,
		breakpoints
	}}
	class={`m-${spacing}`}
>
	<Carousel.Content
		aria-label="Carousel Content"
		data-testid="carousel-content"
		class={`gap-${slideSpacing}`}
	>
		{#each slides as slide, i}
			<Carousel.Item
				aria-label={slide.type === 'image'
					? `Image slide: ${slide.alt}`
					: slide.type === 'text'
						? `Text slide: ${slide.title || 'Untitled'}`
						: `Article slide: ${slide.title}`}
				data-testid={`carousel-slide-${i + 1}-${slide.type}`}
				class={`flex items-center justify-center p-6 aspect-${aspectRatio}`}
			>
				{#if slide.type === 'image'}
					<img
						src={slide.src}
						alt={slide.alt}
						class="object-cover"
						data-testid={`carousel-image-${i + 1}`}
					/>
				{:else if slide.type === 'text'}
					<div class="max-w-prose text-center" data-testid={`carousel-text-${i + 1}`}>
						{#if slide.title}
							<h2 class="mb-4 text-2xl font-bold" data-testid={`carousel-text-title-${i + 1}`}>
								{slide.title}
							</h2>
						{/if}
						<p class="text-lg" data-testid={`carousel-text-content-${i + 1}`}>{slide.content}</p>
					</div>
				{:else if slide.type === 'article'}
					<article class="prose max-w-prose" data-testid={`carousel-article-${i + 1}`}>
						<h2 class="mb-2 text-2xl font-bold" data-testid={`carousel-article-title-${i + 1}`}>
							{slide.title}
						</h2>
						<p class="mb-4" data-testid={`carousel-article-content-${i + 1}`}>{slide.content}</p>
						{#if slide.author}
							<p class="text-sm text-gray-600" data-testid={`carousel-article-author-${i + 1}`}>
								By {slide.author}
							</p>
						{/if}
					</article>
				{/if}
			</Carousel.Item>
		{/each}
	</Carousel.Content>

	<Carousel.Previous
		onclick={() => api?.scrollPrev()}
		aria-label="Previous Slide"
		data-testid="carousel-previous"
		class={`-left-${buttonOffset}`}
	/>
	<Carousel.Next
		onclick={() => api?.scrollNext()}
		aria-label="Next Slide"
		data-testid="carousel-next"
		class={`-right-${buttonOffset}`}
	/>
	<span aria-label="Slide Indicator" data-testid="carousel-indicator">
		{current + 1} / {count}
	</span>
</Carousel.Root>
