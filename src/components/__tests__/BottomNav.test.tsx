import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BottomNav } from '../BottomNav';

describe('BottomNav Component', () => {
  const defaultProps = {
    onOpenJournal: vi.fn(),
    onOpenSos: vi.fn(),
    onOpenHarmAtlas: vi.fn(),
    onOpenTaper: vi.fn(),
  };

  it('renders all 5 navigation buttons with correct aria-labels', () => {
    render(<BottomNav {...defaultProps} />);

    expect(screen.getByLabelText('Главная')).toBeInTheDocument();
    expect(screen.getByLabelText('Дневник самочувствия')).toBeInTheDocument();
    expect(screen.getByLabelText('Экстренная помощь SOS')).toBeInTheDocument();
    expect(screen.getByLabelText('Атлас вреда кофеина')).toBeInTheDocument();
    expect(screen.getByLabelText('Программа снижения')).toBeInTheDocument();
  });

  it('triggers onOpenJournal, onOpenSos, onOpenHarmAtlas, onOpenTaper on click', () => {
    render(<BottomNav {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Дневник самочувствия'));
    expect(defaultProps.onOpenJournal).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Экстренная помощь SOS'));
    expect(defaultProps.onOpenSos).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Атлас вреда кофеина'));
    expect(defaultProps.onOpenHarmAtlas).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Программа снижения'));
    expect(defaultProps.onOpenTaper).toHaveBeenCalledTimes(1);
  });

  it('scrolls to top when Главная is clicked', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<BottomNav {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Главная'));
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollToSpy.mockRestore();
  });

  it('highlights the activeTab with aria-pressed and active color styling', () => {
    const { rerender } = render(<BottomNav {...defaultProps} activeTab="journal" />);
    const journalBtn = screen.getByLabelText('Дневник самочувствия');
    expect(journalBtn).toHaveAttribute('aria-pressed', 'true');
    expect(journalBtn.className).toContain('text-surge-cyan');

    // Switch to harmAtlas
    rerender(<BottomNav {...defaultProps} activeTab="harmAtlas" />);
    const atlasBtn = screen.getByLabelText('Атлас вреда кофеина');
    expect(atlasBtn).toHaveAttribute('aria-pressed', 'true');
    expect(atlasBtn.className).toContain('text-rose-400');
    expect(journalBtn).toHaveAttribute('aria-pressed', 'false');

    // When activeTab is null
    rerender(<BottomNav {...defaultProps} activeTab={null} />);
    expect(journalBtn).toHaveAttribute('aria-pressed', 'false');
    expect(atlasBtn).toHaveAttribute('aria-pressed', 'false');
  });
});
