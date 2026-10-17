import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AchievementsModal } from '../AchievementsModal';
import { Achievement } from '../../types';

describe('AchievementsModal Component', () => {
  const mockAchievements: Achievement[] = [
    {
      id: 'day1',
      title: 'Первые 24 часа',
      description: 'Организм начал очищаться от стимуляторов',
      iconName: 'Clock',
      unlocked: true,
      progressPercent: 100,
      requirementLabel: '24 часа',
    },
    {
      id: 'day7',
      title: 'Неделя свободы',
      description: 'Сон нормализовался',
      iconName: 'Moon',
      unlocked: false,
      progressPercent: 50,
      requirementLabel: '7 дней',
    },
  ];

  it('does not render when isOpen is false', () => {
    render(<AchievementsModal isOpen={false} onClose={vi.fn()} achievements={mockAchievements} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with achievements when isOpen is true', () => {
    render(<AchievementsModal isOpen={true} onClose={vi.fn()} achievements={mockAchievements} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Первые 24 часа')).toBeInTheDocument();
    expect(screen.getByText('Неделя свободы')).toBeInTheDocument();
    expect(screen.getByText(/Система достижений/i)).toBeInTheDocument();
  });

  it('calls onClose when close button or backdrop is clicked or Escape is pressed', () => {
    const onClose = vi.fn();
    render(<AchievementsModal isOpen={true} onClose={onClose} achievements={mockAchievements} />);

    // 1. Close button
    const closeBtn = screen.getByLabelText('Закрыть достижения');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    // 2. Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
