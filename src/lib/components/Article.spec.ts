import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Article from './Article.svelte';

describe('Article component', () => {
	it('renders with prose classes', () => {
		const { container } = render(Article, {
			props: {
				title: 'Test Title',
				text: 'Test content'
			}
		});

		const article = container.querySelector('article');
		expect(article?.classList.contains('prose')).toBe(true);
	});

	it('renders props content correctly', () => {
		const { container } = render(Article, {
			props: {
				title: 'Hello World',
				text: 'This is a test'
			}
		});

		const heading = container.querySelector('h1');
		const paragraph = container.querySelector('p');

		expect(heading?.textContent).toBe('Hello World');
		expect(paragraph?.textContent).toBe('This is a test');
	});
});
