import '@testing-library/jest-dom/vitest';
import '@ant-design/v5-patch-for-react-19';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { resetDb } from '../mocks/db';
import { server } from '../mocks/server';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverStub);

// jsdom does not implement pseudo-element styles; antd asks for them when measuring scrollbars.
const getComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (element: Element) => getComputedStyle(element);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetDb();
});
afterAll(() => server.close());
