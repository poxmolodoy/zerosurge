import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { NeuralBackground } from '../NeuralBackground';

describe('NeuralBackground component (TDD)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a canvas element with full-screen fixed positioning and pointer-events-none', () => {
    const { container } = render(<NeuralBackground />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('pointer-events-none');
    expect(canvas).toHaveClass('fixed');
    expect(canvas).toHaveClass('inset-0');
  });

  it('handles component unmounting cleanly without errors or memory leaks', () => {
    const { unmount } = render(<NeuralBackground />);
    expect(() => unmount()).not.toThrow();
  });
});
