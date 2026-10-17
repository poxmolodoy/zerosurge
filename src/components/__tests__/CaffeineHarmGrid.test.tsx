import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CaffeineHarmGrid } from '../CaffeineHarmGrid';

describe('CaffeineHarmGrid Component (TDD)', () => {
  it('renders section title, subtitle, and all 6 organ system tiles', () => {
    render(<CaffeineHarmGrid />);

    expect(screen.getByText(/Вред стимуляторов/i)).toBeInTheDocument();
    expect(screen.getByText('Сердечно-сосудистая система')).toBeInTheDocument();
    expect(screen.getByText('Нервная система и сон')).toBeInTheDocument();
    expect(screen.getByText('Эндокринная система')).toBeInTheDocument();
    expect(screen.getByText('ЖКТ и пищеварение')).toBeInTheDocument();
    expect(screen.getByText('Почки и электролиты')).toBeInTheDocument();
    expect(screen.getByText('Зубы и ротовая полость')).toBeInTheDocument();
  });

  it('opens HarmDetailModal when clicking on a harm tile', () => {
    render(<CaffeineHarmGrid />);

    const cardioTile = screen.getByText('Сердечно-сосудистая система').closest('div[role="button"]') || screen.getByText('Сердечно-сосудистая система');
    fireEvent.click(cardioTile);

    // Modal should now be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Биохимический механизм поражения/i)).toBeInTheDocument();
  });

  it('closes HarmDetailModal when clicking close button in modal', () => {
    render(<CaffeineHarmGrid />);

    const cardioTile = screen.getByText('Сердечно-сосудистая система');
    fireEvent.click(cardioTile);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeBtn = screen.getAllByRole('button', { name: /закрыть/i })[0];
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
