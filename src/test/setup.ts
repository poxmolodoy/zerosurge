import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage if missing or incomplete in jsdom
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock HTMLCanvasElement.prototype.getContext for jsdom
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  closePath: vi.fn(),
  setTransform: vi.fn(),
  scale: vi.fn(),
  createLinearGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Mock navigator.storage in jsdom
if (typeof navigator !== 'undefined') {
  Object.defineProperty(navigator, 'storage', {
    value: {
      persisted: vi.fn().mockResolvedValue(true),
      persist: vi.fn().mockResolvedValue(true),
      estimate: vi.fn().mockResolvedValue({ quota: 10000000, usage: 1000 }),
    },
    configurable: true,
    writable: true,
  });
}

// Mock window.matchMedia in jsdom
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
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
}

// Mock window.scrollTo in jsdom
if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn();
}
