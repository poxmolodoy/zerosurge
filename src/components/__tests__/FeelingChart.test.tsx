import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeelingChart } from '../FeelingChart';

describe('FeelingChart Component (Systematic Debugging)', () => {
  const dummyCheckIns = [
    { date: '2026-10-15', timestamp: 1, energy: 3, sleep: 4, craving: 2 },
    { date: '2026-10-16', timestamp: 2, energy: 4, sleep: 5, craving: 1 },
  ];

  it('renders chart title, legend, and SVG elements', () => {
    render(<FeelingChart checkIns={dummyCheckIns} />);

    expect(screen.getByText('График самочувствия и динамики восстановления')).toBeInTheDocument();
    expect(screen.getByText(/Натуральная энергия/i)).toBeInTheDocument();
    expect(screen.getByText(/Качество сна/i)).toBeInTheDocument();
    expect(screen.getByText(/Тяга к стимуляторам/i)).toBeInTheDocument();
  });

  it('does NOT have jitter-inducing hover:scale-150 on the blue energy SVG circle', () => {
    const { container } = render(<FeelingChart checkIns={dummyCheckIns} />);

    const circles = container.querySelectorAll('circle');
    circles.forEach((circle) => {
      // In SVG, CSS scale without transform-box/origin causes coordinate oscillation
      const className = circle.getAttribute('class') || '';
      expect(className).not.toContain('hover:scale-150');
    });
  });

  it('shows tooltip on point hover and removes it on mouse leave', () => {
    const { container } = render(<FeelingChart checkIns={dummyCheckIns} />);

    const firstCircle = container.querySelector('circle');
    expect(firstCircle).not.toBeNull();

    if (firstCircle) {
      fireEvent.mouseEnter(firstCircle);
      expect(screen.getByText(/Энергия:/i)).toBeInTheDocument();

      fireEvent.mouseLeave(firstCircle);
      expect(screen.queryByText(/Энергия:/i)).toBeNull(); // state cleanup
    }
  });
});
