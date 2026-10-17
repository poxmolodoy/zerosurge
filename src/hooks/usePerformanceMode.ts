import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'zero_surge_disable_effects';
const CSS_CLASS = 'performance-mode';

export interface PerformanceModeHook {
  isPerformanceMode: boolean;
  togglePerformanceMode: () => void;
}

export function usePerformanceMode(): PerformanceModeHook {
  const [isPerformanceMode, setIsPerformanceMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isPerformanceMode) {
        document.documentElement.classList.add(CSS_CLASS);
      } else {
        document.documentElement.classList.remove(CSS_CLASS);
      }
    } catch (err) {
      console.error('Error applying performance mode class:', err);
    }
  }, [isPerformanceMode]);

  const togglePerformanceMode = useCallback(() => {
    setIsPerformanceMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch (err) {
        console.error('Error saving performance mode to localStorage:', err);
      }
      return next;
    });
  }, []);

  return {
    isPerformanceMode,
    togglePerformanceMode,
  };
}
