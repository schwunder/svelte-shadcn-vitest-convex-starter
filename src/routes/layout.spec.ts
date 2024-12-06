import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/svelte';
import Layout from './+layout.svelte';
import type { Snippet } from 'svelte';

// Mock WebSocket
class MockWebSocket {
	private readonly mockFn = vi.fn();

	// Basic WebSocket methods
	addEventListener(type: string, listener: EventListener): void {
		this.mockFn(type, listener);
	}
	removeEventListener(type: string, listener: EventListener): void {
		this.mockFn(type, listener);
	}
	dispatchEvent(event: Event): boolean {
		return this.mockFn(event);
	}
	close(): void {
		this.mockFn();
	}
	send(data: string): void {
		this.mockFn(data);
	}

	// Required properties
	readonly CONNECTING = 0;
	readonly OPEN = 1;
	readonly CLOSING = 2;
	readonly CLOSED = 3;
	readonly readyState = this.CLOSED;
	readonly bufferedAmount = 0;
	readonly url = '';
	readonly protocol = '';
	readonly extensions = '';
	readonly binaryType: BinaryType = 'blob';

	// Event handlers
	onopen: ((ev: Event) => void) | null = null;
	onclose: ((ev: CloseEvent) => void) | null = null;
	onerror: ((ev: Event) => void) | null = null;
	onmessage: ((ev: MessageEvent) => void) | null = null;
}

// Mock setup
beforeAll(() => {
	// Mock window.matchMedia
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn()
		}))
	});

	// Mock WebSocket
	Object.defineProperty(global, 'WebSocket', {
		writable: true,
		value: MockWebSocket
	});
});

describe('Layout', () => {
	it('renders header and footer', () => {
		const mockChildren = (() => ({
			'@render': () => 'Mock Content'
		})) as unknown as Snippet;

		const { container } = render(Layout, {
			props: {
				children: mockChildren
			}
		});

		expect(container.querySelector('header')).toBeTruthy();
		expect(container.querySelector('footer')).toBeTruthy();
	});
});
