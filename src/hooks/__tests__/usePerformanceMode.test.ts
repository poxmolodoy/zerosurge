import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePerformanceMode } from '../usePerformanceMode';

describe('usePerformanceMode Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('performance-mode');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('performance-mode');
  });

  it('initializes with false by default and does not add performance-mode class', () => {
    const { result } = renderHook(() => usePerformanceMode());
    expect(result.current.isPerformanceMode).toBe(false);
    expect(document.documentElement.classList.contains('performance-mode')).toBe(false);
  });

  it('restores true from localStorage on mount and adds performance-mode class', () => {
    localStorage.setItem('zero_surge_disable_effects', 'true');
    const { result } = renderHook(() => usePerformanceMode());
    expect(result.current.isPerformanceMode).toBe(true);
    expect(document.documentElement.classList.contains('performance-mode')).toBe(true);
  });

  it('toggles performance mode and updates localStorage and DOM class', () => {
    const { result } = renderHook(() => usePerformanceMode());
    expect(result.current.isPerformanceMode).toBe(false);

    act(() => {
      result.current.togglePerformanceMode();
    });

    expect(result.current.isPerformanceMode).toBe(true);
    expect(localStorage.getItem('zero_surge_disable_effects')).toBe('true');
    expect(document.documentElement.classList.contains('performance-mode')).toBe(true);

    act(() => {
      result.current.togglePerformanceMode();
    });

    expect(result.current.isPerformanceMode).toBe(false);
    expect(localStorage.getItem('zero_surge_disable_effects')).toBe('false');
    expect(document.documentElement.classList.contains('performance-mode')).toBe(false);
  });

  it('defaults to true if prefers-reduced-motion is active and no stored preference exists', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => usePerformanceMode());
    expect(result.current.isPerformanceMode).toBe(true);
    expect(document.documentElement.classList.contains('performance-mode')).toBe(true);
  });
});
