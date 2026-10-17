import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  const defaultProps = {
    onOpenSos: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenRelapse: vi.fn(),
    isPerformanceMode: false,
    onTogglePerformanceMode: vi.fn(),
  };

  it('renders all main controls and branding', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText('Zero')).toBeInTheDocument();
    expect(screen.getByText('Surge')).toBeInTheDocument();
    expect(screen.getByText(/SOS/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Настройки профиля')).toBeInTheDocument();
    expect(screen.getByLabelText('Зафиксировать срыв')).toBeInTheDocument();
  });

  it('renders lightning performance toggle button between SOS and Settings with tooltip "Отключить эффекты" when mode is off', () => {
    render(<Header {...defaultProps} isPerformanceMode={false} />);

    const toggleBtn = screen.getByTitle('Отключить эффекты');
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute('aria-label', 'Отключить эффекты');

    fireEvent.click(toggleBtn);
    expect(defaultProps.onTogglePerformanceMode).toHaveBeenCalledTimes(1);
  });

  it('renders lightning performance toggle button with tooltip "Включить эффекты" when mode is on', () => {
    const onToggle = vi.fn();
    render(
      <Header {...defaultProps} isPerformanceMode={true} onTogglePerformanceMode={onToggle} />
    );

    const toggleBtn = screen.getByTitle('Включить эффекты');
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute('aria-label', 'Включить эффекты');

    fireEvent.click(toggleBtn);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders Trophy button left of SOS and calls onOpenAchievements on click', () => {
    const onOpenAchievements = vi.fn();
    render(<Header {...defaultProps} onOpenAchievements={onOpenAchievements} />);

    const trophyBtn = screen.getByTitle('Достижения');
    expect(trophyBtn).toBeInTheDocument();
    expect(trophyBtn).toHaveAttribute('aria-label', 'Открыть достижения');

    fireEvent.click(trophyBtn);
    expect(onOpenAchievements).toHaveBeenCalledTimes(1);
  });

  it('renders Calendar button right of SOS and calls onOpenJournal on click', () => {
    const onOpenJournal = vi.fn();
    render(<Header {...defaultProps} onOpenJournal={onOpenJournal} />);

    const journalBtn = screen.getByTitle('Дневник и график самочувствия');
    expect(journalBtn).toBeInTheDocument();
    expect(journalBtn).toHaveAttribute('aria-label', 'Открыть дневник и график самочувствия');

    fireEvent.click(journalBtn);
    expect(onOpenJournal).toHaveBeenCalledTimes(1);
  });

  it('renders BookOpen button between Calendar and Trophy with "Книга знаний: Клинический атлас вреда" tooltip and calls onOpenHarmAtlas on click', () => {
    const onOpenHarmAtlas = vi.fn();
    render(<Header {...defaultProps} onOpenHarmAtlas={onOpenHarmAtlas} />);

    const harmAtlasBtn = screen.getByTitle('Книга знаний: Клинический атлас вреда');
    expect(harmAtlasBtn).toBeInTheDocument();
    expect(harmAtlasBtn).toHaveAttribute(
      'aria-label',
      'Открыть книгу знаний: клинический атлас вреда'
    );
    expect(screen.getByText('Книга знаний: Атлас вреда')).toBeInTheDocument();

    fireEvent.click(harmAtlasBtn);
    expect(onOpenHarmAtlas).toHaveBeenCalledTimes(1);
  });
});
