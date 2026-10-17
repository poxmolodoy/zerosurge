import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HealthJournalModal } from '../HealthJournalModal';
import { DailyCheckIn } from '../../types';

describe('HealthJournalModal Component', () => {
  const mockCheckIns: DailyCheckIn[] = [
    {
      date: '2026-10-16',
      energy: 3,
      sleep: 4,
      craving: 2,
      timestamp: 1697400000000,
    },
  ];

  it('does not render when isOpen is false', () => {
    render(
      <HealthJournalModal
        isOpen={false}
        onClose={vi.fn()}
        checkIns={mockCheckIns}
        onAddCheckIn={vi.fn()}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with daily checkin card and feeling chart when isOpen is true', () => {
    render(
      <HealthJournalModal
        isOpen={true}
        onClose={vi.fn()}
        checkIns={mockCheckIns}
        onAddCheckIn={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Дневник самочувствия/i)).toBeInTheDocument();
    expect(screen.getByText(/Как вы чувствуете себя сегодня?/i)).toBeInTheDocument();
    expect(screen.getByText(/График самочувствия и динамики восстановления/i)).toBeInTheDocument();
  });

  it('calls onClose when close button or backdrop is clicked or Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <HealthJournalModal
        isOpen={true}
        onClose={onClose}
        checkIns={mockCheckIns}
        onAddCheckIn={vi.fn()}
      />
    );

    // 1. Close button
    const closeBtn = screen.getByLabelText('Закрыть дневник');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    // 2. Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
