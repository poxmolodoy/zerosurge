import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HarmDetailModal } from '../HarmDetailModal';
import { CAFFEINE_HARM_DATA } from '../../data/caffeineHarmData';

describe('HarmDetailModal Component (TDD)', () => {
  const sampleItem = CAFFEINE_HARM_DATA[0]; // Cardiovascular

  it('renders nothing when item is null', () => {
    const { container } = render(<HarmDetailModal item={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal with medical mechanism, symptoms, timeline, and citation', () => {
    render(<HarmDetailModal item={sampleItem} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(sampleItem.title)).toBeInTheDocument();
    expect(screen.getByText(sampleItem.systemName)).toBeInTheDocument();
    expect(screen.getByText(sampleItem.badgeLabel)).toBeInTheDocument();
    expect(screen.getByText(/Биохимический механизм поражения/i)).toBeInTheDocument();
    expect(screen.getByText(sampleItem.clinicalMechanism)).toBeInTheDocument();

    // Check symptoms
    sampleItem.symptoms.forEach((s) => {
      expect(screen.getByText(s)).toBeInTheDocument();
    });

    // Check timeline & citation
    expect(screen.getByText(sampleItem.reversibilityTimeline)).toBeInTheDocument();
    expect(screen.getByText(sampleItem.medicalCitation)).toBeInTheDocument();
  });

  it('calls onClose when clicking close button or pressing Escape', () => {
    const onClose = vi.fn();
    render(<HarmDetailModal item={sampleItem} onClose={onClose} />);

    const closeBtn = screen.getAllByRole('button', { name: /закрыть/i })[0];
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
