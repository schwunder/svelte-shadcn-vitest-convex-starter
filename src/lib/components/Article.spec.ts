import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import Article from './Article.svelte';

afterEach(() => {
	cleanup();
});

describe('Article component', () => {
	it('renders with prose classes', () => {
		const { container } = render(Article, {
			props: {
				title: 'Test Title',
				text: 'Test content'
			}
		});

		const article = container.querySelector('[data-testid="article"]');
		expect(article?.classList.contains('prose')).toBe(true);
	});

	it('renders props content correctly', () => {
		const { container } = render(Article, {
			props: {
				title: 'Hello World',
				text: 'This is a test'
			}
		});

		const heading = container.querySelector('[data-testid="article-title"]');
		const paragraph = container.querySelector('[data-testid="article-text"]');

		expect(heading?.textContent).toBe('Hello World');
		expect(paragraph?.textContent).toBe('This is a test');
	});

	it('applies correct ARIA labels', () => {
		const { container } = render(Article, {
			props: {
				title: 'Test Title',
				text: 'Test content'
			}
		});

		const article = container.querySelector('[data-testid="article"]');
		const title = container.querySelector('[data-testid="article-title"]');
		const text = container.querySelector('[data-testid="article-text"]');

		expect(article?.getAttribute('aria-label')).toBe('Article');
		expect(title?.getAttribute('aria-label')).toBe('Title');
		expect(text?.getAttribute('aria-label')).toBe('Text');
	});

	it('applies correct data attributes', () => {
		const { container } = render(Article, {
			props: {
				title: 'Test Title',
				text: 'Test content'
			}
		});

		const article = container.querySelector('article');
		expect(article).toBeTruthy();

		if (article) {
			expect(article.classList.contains('prose')).toBe(true);
			expect(article.getAttribute('aria-label')).toBe('Article');
		}
	});
});
